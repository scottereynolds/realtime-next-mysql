// src/lib/messagesSocket.ts

import { prisma } from "@/lib/prisma";
import type {
  Conversation,
  ConversationParticipant,
  Message,
  User,
} from "@prisma/client";
import { io, type Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/types/socket";

type ConversationWithParticipants = Conversation & {
  participants: Pick<ConversationParticipant, "userId" | "lastReadAt">[];
};

type MessageWithSender = Message & {
  sender: Pick<User, "id" | "name" | "image"> | null;
};

// Singleton Socket.IO client used by the Next.js server to talk to ws-server
let serverSocket: Socket | null = null;

/**
 * Lazily initialize a singleton Socket.IO client that connects to ws-server.js.
 * In dev: ws-server.js is usually on http://localhost:4000
 * In prod: override via NEXT_PUBLIC_WS_SERVER_URL.
 */
function getServerSocket(): Socket | null {
  if (serverSocket && serverSocket.connected) {
    return serverSocket;
  }

  const url =
    process.env.NEXT_PUBLIC_WS_SERVER_URL ?? "http://localhost:4000";

  try {
    serverSocket = io(url, {
      autoConnect: true,
      transports: ["websocket"],
      reconnection: true,
    });

    serverSocket.on("connect", () => {
      console.log(
        "[messagesSocket] Connected to ws-server:",
        serverSocket?.id,
      );
    });

    serverSocket.on("connect_error", (err: any) => {
      console.error(
        "[messagesSocket] connect_error to ws-server:",
        err?.message ?? err,
      );
    });

    serverSocket.on("disconnect", (reason: string) => {
      console.warn("[messagesSocket] disconnected from ws-server:", reason);
    });

    return serverSocket;
  } catch (err) {
    console.error(
      "[messagesSocket] Failed to initialize Socket.IO client for ws-server:",
      err,
    );
    return null;
  }
}

/**
 * Emit a new message event via ws-server to all browser clients.
 * Browser clients will filter by conversationId / userId as needed.
 */
export async function broadcastNewMessage(
  conversation: ConversationWithParticipants,
  message: MessageWithSender,
) {
  const socket = getServerSocket();
  if (!socket) return;

  const payload = {
    conversationId: conversation.id,
    message,
  };

  socket.emit(SOCKET_EVENTS.MESSAGE_NEW, payload);

  // Refresh unread summary for all *other* participants
  const senderId = message.senderId;
  const refreshPromises: Promise<unknown>[] = [];

  for (const participant of conversation.participants) {
    if (participant.userId === senderId) continue;
    refreshPromises.push(broadcastUnreadSummary(participant.userId));
  }

  await Promise.all(refreshPromises);
}

/**
 * Compute unread summary for a user and emit it via ws-server.
 */
export async function broadcastUnreadSummary(userId: string) {
  const socket = getServerSocket();
  if (!socket) return;

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
        AND: [
          { senderId: { not: userId } },
          { NOT: { senderId: null } }, // 👈 ignore null senders
        ],
      },
    });

    summary.push({
      conversationId: convo.id,
      unreadCount,
    });
  }

  const totalUnread = summary.reduce(
    (sum, item) => sum + item.unreadCount,
    0,
  );

  socket.emit(SOCKET_EVENTS.MESSAGES_UNREAD_SUMMARY, {
    userId,
    totalUnread,
    conversations: summary,
  });
}

/**
 * Broadcast that a conversation has been created.
 * We include participants so the client can filter or refetch if needed.
 */
export async function broadcastConversationCreated(conversationId: number) {
  const socket = getServerSocket();
  if (!socket) return;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!conversation) return;

  const payload = {
    conversationId: conversation.id,
    conversationType: conversation.type,
    title: conversation.title ?? null,
    participantIds: conversation.participants.map((p) => p.userId),
  };

  socket.emit(SOCKET_EVENTS.CONVERSATION_CREATED, payload);

  // Keep their badge counts up-to-date as soon as a convo exists
  const promises: Promise<unknown>[] = [];
  for (const participant of conversation.participants) {
    promises.push(broadcastUnreadSummary(participant.userId));
  }

  await Promise.all(promises);
}

/**
 * Mark a conversation as "seen" for a specific user and broadcast to clients.
 */
export async function broadcastMessageSeen(
  conversationId: number,
  userId: string,
) {
  // Always update the DB
  const participant = await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });

  const lastReadAt = participant.lastReadAt ?? new Date();

  const socket = getServerSocket();
  if (!socket) return;

  const payload = {
    conversationId,
    userId,
    lastReadAt: lastReadAt.toISOString(),
  };

  socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, payload);

  // Refresh unread badge for the viewer
  await broadcastUnreadSummary(userId);
}

/**
 * Inform the sender that a given message has been delivered to a recipient.
 * (Realtime hint only; not persisted.)
 */
export async function broadcastMessageDelivered(
  messageId: number,
  recipientId: string,
) {
  const socket = getServerSocket();
  if (!socket) return;

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message || !message.senderId || !message.conversationId) {
    return;
  }

  const payload = {
    messageId,
    conversationId: message.conversationId,
    recipientId,
    deliveredAt: new Date().toISOString(),
  };

  socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, payload);
}

/**
 * User typing / stopped typing:
 * Just emit via ws-server and let clients filter based on conversationId/userId.
 */
export async function broadcastUserTyping(
  conversationId: number,
  userId: string,
) {
  const socket = getServerSocket();
  if (!socket) return;

  const payload = {
    conversationId,
    userId,
  };

  socket.emit(SOCKET_EVENTS.USER_TYPING, payload);
}

export async function broadcastUserStoppedTyping(
  conversationId: number,
  userId: string,
) {
  const socket = getServerSocket();
  if (!socket) return;

  const payload = {
    conversationId,
    userId,
  };

  socket.emit(SOCKET_EVENTS.USER_STOPPED_TYPING, payload);
}
