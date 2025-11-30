export type ConversationType = "direct" | "group";

export interface ConversationLatestMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface ConversationParticipantUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface ConversationListItem {
  id: number;
  type: ConversationType;
  title: string | null;
  updatedAt: string;
  unreadCount: number;
  latestMessage: ConversationLatestMessage | null;
  otherParticipants: ConversationParticipantUser[];
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export type MessagesByConversation = Record<number, ChatMessage[]>;

export interface SimpleUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export type UnreadSummaryResponse = {
  totalUnread: number;
  conversations: {
    conversationId: number;
    unreadCount: number;
  }[];
  userId?: string; // present on socket payload, not on HTTP response
};
