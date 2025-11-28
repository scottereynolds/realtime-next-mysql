import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // All conversations the current user is in
    const participantRecords = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const conversations = await Promise.all(
      participantRecords.map(async (participant) => {
        const conversation = participant.conversation;

        // Latest message in this conversation
        const latestMessage = await prisma.message.findFirst({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: "desc" },
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

        // 👇 FIX: don't use participant.joinedAt – it doesn't exist in your schema
        // If the user has never read, treat everything as unread since the dawn of time.
        const threshold = participant.lastReadAt ?? new Date(0);

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            createdAt: { gt: threshold },
            // Don't count messages you sent yourself as "unread"
            senderId: { not: userId },
          },
        });

        const otherParticipants = conversation.participants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user);

        return {
          id: conversation.id,
          type: conversation.type,
          title: conversation.title,
          updatedAt: conversation.updatedAt,
          unreadCount,
          latestMessage: latestMessage
            ? {
                id: latestMessage.id,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt,
                sender: latestMessage.sender
                  ? {
                      id: latestMessage.sender.id,
                      name: latestMessage.sender.name,
                      image: latestMessage.sender.image,
                    }
                  : null,
              }
            : null,
          otherParticipants: otherParticipants.map((u) => ({
            id: u.id,
            name: u.name,
            image: u.image,
          })),
        };
      }),
    );

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (err) {
    console.error("GET /api/messages/conversations error:", err);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 },
    );
  }
}
