"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthRole, PermissionKey } from "@/types/auth";

export interface UseRequireAuthOptions {
  roles?: AuthRole[];
  permissions?: PermissionKey[];
}

/**
 * useRequireAuth
 *
 * Centralizes auth/authorization checks.
 * Does NOT redirect by itself; it just tells you if the user is allowed.
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { roles, permissions } = options;
  const {
    status,
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
  } = useAuth();

  const isAuthorized = useMemo(() => {
    if (!isAuthenticated) return false;

    // If specific roles are required, user must match at least one.
    if (roles && roles.length > 0) {
      if (!hasRole(...roles)) return false;
    }

    // If specific permissions are required, user must have at least one.
    if (permissions && permissions.length > 0) {
      if (!hasPermission(...permissions)) return false;
    }

    return true;
  }, [isAuthenticated, roles, permissions, hasRole, hasPermission]);

  return {
    status,
    user,
    isAuthenticated,
    isLoading,
    isAuthorized,
  };
}
