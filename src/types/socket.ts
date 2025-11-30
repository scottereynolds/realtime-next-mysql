export const SOCKET_EVENTS = {
  MESSAGE_CREATED: "message:created",
  MESSAGE_UPDATED: "message:updated",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_NEW: "message:new", // what broadcastNewMessage uses
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_SEEN: "message:seen",
  CONVERSATION_CREATED: "conversation:created",
  USER_TYPING: "user:typing",
  USER_STOPPED_TYPING: "user:stoppedTyping",
  MESSAGES_UNREAD_SUMMARY: "messages:unreadSummary",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
