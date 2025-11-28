import { prisma } from "@/lib/prisma";
import type { Conversation, ConversationParticipant, Message, User } from "@prisma/client";
import { getIO } from "@/lib/socket";

type ConversationWithParticipants = Conversation & {
  participants: Pick<ConversationParticipant, "userId" | "lastReadAt">[];
};

type MessageWithSender = Message & {
  sender: Pick<User, "id" | "name" | "image"> | null;
};

/**
 * Emit a new message to all participants in a conversation.
 * Each client should join a room like `user:<userId>` using useSocket().
 */
export async function broadcastNewMessage(
  conversation: ConversationWithParticipants,
  message: MessageWithSender,
) {
  const io = getIO();

  const payload = {
    conversationId: conversation.id,
    message,
  };

  for (const participant of conversation.participants) {
    io.to(`user:${participant.userId}`).emit("message:new", payload);
  }
}

/**
 * Emit unread summary to a single user.
 * - totalUnread: global badge count
 * - conversations: per-conversation unread counts
 */
export async function broadcastUnreadSummary(userId: string) {
  const io = getIO();

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
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
    const participant = convo.participants.find((p) => p.userId === userId);
    const lastReadAt = participant?.lastReadAt ?? new Date(0);

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: convo.id,
        createdAt: {
          gt: lastReadAt,
        },
      },
    });

    summary.push({
      conversationId: convo.id,
      unreadCount,
    });
  }

  const totalUnread = summary.reduce((sum, item) => sum + item.unreadCount, 0);

  io.to(`user:${userId}`).emit("messages:unreadSummary", {
    totalUnread,
    conversations: summary,
  });
}
