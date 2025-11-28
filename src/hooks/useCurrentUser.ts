// src/hooks/useCurrentUser.ts
"use client";

import { useSession } from "next-auth/react";
import type { AuthStatus, AuthUser } from "@/types/auth";

interface UseCurrentUserResult {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useCurrentUser(): UseCurrentUserResult {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role,
      }
    : null;

  const isAuthenticated = status === "authenticated" && !!user;
  const isLoading = status === "loading";
  const isAdmin = !!user && user.role === "administrator";

  return {
    status,
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
  };
}
