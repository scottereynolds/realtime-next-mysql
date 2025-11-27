// src/features/auth/components/RequireAuth.tsx
"use client";

import type { ReactNode } from "react";
import { useRequireAuth, type UseRequireAuthOptions } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { BaseStack } from "@/components/MUI/Layout/BaseStack";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseCircularProgress } from "@/components/MUI/Feedback/BaseProgress";

interface RequireAuthProps extends UseRequireAuthOptions {
  children: ReactNode;
}

/**
 * RequireAuth
 *
 * Client-side gate for protected sections.
 * - Shows a spinner while auth is loading
 * - Shows a "Sign in with GitHub" prompt if unauthenticated
 * - Shows "not authorized" if user lacks required roles/permissions
 * - Otherwise renders children
 */
export function RequireAuth({ children, roles, permissions }: RequireAuthProps) {
  const { isLoading, isAuthenticated, isAuthorized } = useRequireAuth({
    roles,
    permissions,
  });
  const { signInWithGithub } = useAuth();

  if (isLoading) {
    return (
      <BaseStack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "200px" }}
      >
        <BaseCircularProgress />
      </BaseStack>
    );
  }

  if (!isAuthenticated) {
    return (
      <BaseStack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "200px" }}
      >
        <p>You need to sign in to access this page.</p>
        <BaseButton variant="contained" onClick={signInWithGithub}>
          Sign in with GitHub
        </BaseButton>
      </BaseStack>
    );
  }

  if (!isAuthorized) {
    return (
      <BaseStack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "200px" }}
      >
        <p>You don&apos;t have permission to view this content.</p>
      </BaseStack>
    );
  }

  return <>{children}</>;
}
