export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiErrorPayload {
  message?: string;
  code?: string;
  [key: string]: unknown;
}
