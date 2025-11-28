import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const currentUserId = session?.user?.id as string | undefined;

  if (!currentUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: currentUserId,
        },
      },
    },
    include: {
      participants: true,
    },
  });

  const summary: {
    conversationId: number;
    unreadCount: number;
  }[] = [];

  for (const convo of conversations) {
    const participant = convo.participants.find(
      (p) => p.userId === currentUserId,
    );

    const lastReadAt = participant?.lastReadAt ?? new Date(0);

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: convo.id,
        createdAt: {
          gt: lastReadAt,
        },
        // 🚫 don't count messages from the current user
        senderId: {
          not: currentUserId,
        },
      },
    });

    summary.push({
      conversationId: convo.id,
      unreadCount,
    });
  }

  const totalUnread = summary.reduce((sum, item) => sum + item.unreadCount, 0);

  return NextResponse.json({
    totalUnread,
    conversations: summary,
  });
}
