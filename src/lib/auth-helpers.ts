import type { Session } from "next-auth";
import { auth } from "@/auth";

type AuthenticatedSession = Session & {
  user: NonNullable<Session["user"]>;
};

/**
 * Ensure there is an authenticated user.
 * Throws if not authenticated.
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  return session as AuthenticatedSession;
}

/**
 * Ensure the *real* (non-impersonated) user is an administrator.
 * Uses `realUserRole` when available, otherwise falls back to `role`.
 */
export async function requireAdmin(): Promise<AuthenticatedSession> {
  const session = await requireAuth();

  const user = session.user as any;
  const realRole = (user.realUserRole ?? user.role) as string | undefined;

  if (realRole !== "administrator") {
    throw new Error("Forbidden");
  }

  return session;
}
