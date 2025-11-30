// src/app/api/messages/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  broadcastNewMessage,
  broadcastConversationCreated,
} from "@/lib/messagesSocket";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = session.user.id;
    const sessionEmail = session.user.email ?? undefined;

    // 🔎 Normalize the current user to the DB User row.
    // Try by id first, then fall back to email (important for OAuth).
    let dbUser =
      (sessionUserId
        ? await prisma.user.findUnique({
            where: { id: sessionUserId },
            select: { id: true, email: true },
          })
        : null) ?? (sessionEmail
        ? await prisma.user.findUnique({
            where: { email: sessionEmail },
            select: { id: true, email: true },
          })
        : null);

    if (!dbUser) {
      console.error(
        "[messages/send] No matching User row for session user",
        sessionUserId,
        sessionEmail,
      );
      return NextResponse.json(
        { error: "Current user not found in database" },
        { status: 400 },
      );
    }

    // ✅ From here on, ALWAYS use this id for sender/participants.
    const userId = dbUser.id;

    const bodyJson = await req.json();
    const { conversationId, recipientIds, body } = bodyJson ?? {};

    if (!body || typeof body !== "string" || !body.trim()) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 },
      );
    }

    const authorName =
      session.user.name || session.user.email || "Unknown Sender";

    // ─────────────────────────────────────────────
    // Case 1: Send message into an existing conversation
    // ─────────────────────────────────────────────
    if (conversationId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          id: Number(conversationId),
          participants: {
            some: {
              userId, // <-- DB user id
            },
          },
        },
        include: {
          participants: {
            select: {
              userId: true,
              lastReadAt: true,
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
          author: authorName,
          senderId: userId, // <-- DB user id
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

      // 🔔 Realtime fan-out via our helper
      await broadcastNewMessage(existingConversation, message);

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

    // ─────────────────────────────────────────────
    // Case 2: Start a new conversation
    // ─────────────────────────────────────────────

    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json(
        { error: "recipientIds array is required to start a new conversation" },
        { status: 400 },
      );
    }

    // Distinct recipients, excluding the sender
    const distinctRecipientIds = Array.from(
      new Set<string>(recipientIds as string[]),
    ).filter((id) => id !== userId);

    if (distinctRecipientIds.length === 0) {
      return NextResponse.json(
        { error: "No valid recipient IDs provided" },
        { status: 400 },
      );
    }

    // Look up only *existing* users for those recipients
    const recipientUsers = await prisma.user.findMany({
      where: {
        id: {
          in: distinctRecipientIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (recipientUsers.length === 0) {
      return NextResponse.json(
        {
          error:
            "No matching users found for the provided recipient IDs. Please refresh and try again.",
        },
        { status: 400 },
      );
    }

    const validRecipientIds = recipientUsers.map((u) => u.id);

    // Final participant list: sender + valid recipients
    const participantIds = Array.from(
      new Set<string>([userId, ...validRecipientIds]),
    );

    // 1) Create the conversation WITHOUT nested participants to avoid FK issues
    const baseConversation = await prisma.conversation.create({
      data: {
        type: participantIds.length > 2 ? "group" : "direct",
        title: null,
      },
    });

    // 2) Create participants one-by-one so a bad userId can't kill everything
    for (const pid of participantIds) {
      try {
        // Extra safety: verify the user exists before creating the participant
        const userExists = await prisma.user.findUnique({
          where: { id: pid },
          select: { id: true },
        });

        if (!userExists) {
          console.warn(
            "[messages/send] Skipping participant with non-existent userId:",
            pid,
          );
          continue;
        }

        await prisma.conversationParticipant.create({
          data: {
            conversationId: baseConversation.id,
            userId: pid,
            lastReadAt: pid === userId ? new Date() : null,
          },
        });
      } catch (err) {
        console.error(
          "[messages/send] Failed to create ConversationParticipant for userId",
          pid,
          err,
        );
      }
    }

    // 3) Reload conversation with participants in the shape our helpers expect
    const newConversation = await prisma.conversation.findUnique({
      where: { id: baseConversation.id },
      include: {
        participants: {
          select: {
            userId: true,
            lastReadAt: true,
          },
        },
      },
    });

    if (!newConversation) {
      return NextResponse.json(
        { error: "Failed to load conversation after creation" },
        { status: 500 },
      );
    }

    // 4) Create the first message in the new conversation
    const firstMessage = await prisma.message.create({
      data: {
        content: body.trim(),
        author: authorName,
        senderId: userId, // <-- DB user id
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

    // 5) Broadcast conversation + first message
    await broadcastConversationCreated(newConversation.id);
    await broadcastNewMessage(newConversation, firstMessage);

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
