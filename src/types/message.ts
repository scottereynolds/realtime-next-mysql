// src/types/message.ts

import type { Message as PrismaMessage } from "@prisma/client";

/**
 * Re-export the Prisma type so you have a single place to extend it
 * if needed later.
 */
export type Message = PrismaMessage;

/**
 * Shape of payload your client sends to create a message.
 * This is **frontend input**, not necessarily the DB shape.
 */
export interface CreateMessagePayload {
  content: string;
  author: string;
}

/**
 * Payload for updating a message (if you add edits later).
 */
export interface UpdateMessagePayload {
  id: string;
  content?: string;
}

/**
 * Typical response shape for list endpoints, if you decide to return
 * metadata along with the array.
 */
export interface MessageListResponse {
  items: Message[];
  total?: number;
}

/**
 * Shape of the message your socket broadcasts when a new message is created.
 */
export interface MessageCreatedEvent {
  type: "message:created";
  message: Message;
}

/**
 * Shape of other message-related socket events (optional).
 */
export interface MessageUpdatedEvent {
  type: "message:updated";
  message: Message;
}

export interface MessageDeletedEvent {
  type: "message:deleted";
  id: string;
}

/**
 * Union of all message-related socket events.
 */
export type MessageSocketEvent =
  | MessageCreatedEvent
  | MessageUpdatedEvent
  | MessageDeletedEvent;
