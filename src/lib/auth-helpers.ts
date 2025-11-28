import type { Session } from "next-auth";
import { auth } from "@/auth";

export async function requireAuth(): Promise<Session> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();

  if (session.user.role !== "administrator") {
    throw new Error("Forbidden");
  }

  return session;
}
