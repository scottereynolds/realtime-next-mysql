import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getIO } from "@/lib/socket"; // your existing Socket.IO helper

// Safely try to emit over Socket.IO without crashing the route
function safeBroadcastNewMessage(conversationId: number, message: any) {
  try {
    const io = getIO(); // this used to throw and kill the route
    io.to(`conversation:${conversationId}`).emit("message:new", {
      conversationId,
      message,
    });
  } catch (err) {
    // If Socket.IO isn't initialized, just log and move on
    console.warn(
      "Socket.IO not initialized, skipping broadcast for conversation",
      conversationId,
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const bodyJson = await req.json();
    const { conversationId, recipientIds, body } = bodyJson ?? {};

    if (!body || typeof body !== "string" || !body.trim()) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 },
      );
    }

    // --- Case 1: existing conversation ---
    if (conversationId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          id: Number(conversationId),
          participants: {
            some: {
              userId,
            },
          },
        },
      });

      if (!existingConversation) {
        return NextResponse.json(
          { error: "Conversation not found or access denied" },
          { status: 404 },
        );
      }

      const message = await prisma.message.create({
        data: {
          content: body.trim(),
          author: session.user.name || session.user.email || "Unknown",
          senderId: userId,
          conversationId: existingConversation.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // bump conversation updatedAt
      await prisma.conversation.update({
        where: { id: existingConversation.id },
        data: { updatedAt: new Date() },
      });

      safeBroadcastNewMessage(existingConversation.id, message);

      return NextResponse.json(
        {
          conversationId: existingConversation.id,
          message: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender,
          },
        },
        { status: 200 },
      );
    }

    // --- Case 2: new conversation with recipients ---
    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json(
        { error: "recipientIds array is required to start a new conversation" },
        { status: 400 },
      );
    }

    // Ensure unique participant list & include the sender
    const uniqueParticipantIds = Array.from(
      new Set<string>([userId, ...recipientIds]),
    );

    // Create the conversation
    const newConversation = await prisma.conversation.create({
      data: {
        type: uniqueParticipantIds.length > 2 ? "group" : "direct",
        title: null, // you could generate a title later if you want
        participants: {
          create: uniqueParticipantIds.map((pid) => ({
            userId: pid,
            lastReadAt: pid === userId ? new Date() : null,
          })),
        },
      },
    });

    // First message in the new conversation
    const firstMessage = await prisma.message.create({
      data: {
        content: body.trim(),
        author: session.user.name || session.user.email || "Unknown",
        senderId: userId,
        conversationId: newConversation.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // bump updatedAt
    await prisma.conversation.update({
      where: { id: newConversation.id },
      data: { updatedAt: new Date() },
    });

    safeBroadcastNewMessage(newConversation.id, firstMessage);

    return NextResponse.json(
      {
        conversationId: newConversation.id,
        message: {
          id: firstMessage.id,
          content: firstMessage.content,
          createdAt: firstMessage.createdAt,
          sender: firstMessage.sender,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST /api/messages/send error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
