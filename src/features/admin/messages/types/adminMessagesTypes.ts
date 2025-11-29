export interface AdminMessageUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface AdminMessageConversation {
  id: number;
  type: string;
  title: string | null;
}

export interface AdminMessage {
  id: number;
  content: string;
  createdAt: string; // ISO string from API
  sender: AdminMessageUser | null;
  conversation: AdminMessageConversation | null;
}

export interface AdminMessagesListResponse {
  items: AdminMessage[];
  total: number;
  take: number;
  skip: number;
}
