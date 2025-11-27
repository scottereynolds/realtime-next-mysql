// src/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  SessionProvider,
  useSession,
  signIn as nextSignIn,
  signOut as nextSignOut,
} from "next-auth/react";

import type {
  AppUser,
  AuthContextValue,
  AuthRole,
  AuthStatus,
  PermissionKey,
  AccountStatus,
} from "@/types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Outer provider: wraps NextAuth's SessionProvider.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
}

function AuthInnerProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = useMemo<AuthContextValue>(() => {
    const authStatus = status as AuthStatus;

    // Normalize user shape from NextAuth session into AppUser.
    let user: AppUser | null = null;

    if (session?.user) {
      const u = session.user as any;

      // Reasonable defaults until you wire real roles/status from your backend/JWT.
      const role = (u.role ?? "user") as AuthRole;
      const accountStatus = (u.status ?? "active") as AccountStatus;

      user = {
        id: u.id ?? "",
        email: u.email ?? "",
        name: u.name ?? null,
        username: u.username ?? null,
        role,
        status: accountStatus,
        isSuperAdmin: u.isSuperAdmin ?? false,
        isOrgAdmin: u.isOrgAdmin ?? false,
        permissions: (u.permissions ?? []) as PermissionKey[],
      };
    }

    const isAuthenticated = authStatus === "authenticated";
    const isLoading = authStatus === "loading";

    const signInWithGithub = async () => {
      await nextSignIn("github");
    };

    const signOut = async () => {
      await nextSignOut();
    };

    /**
     * Refresh the auth state.
     *
     * Baseline implementation: reloads the page so useSession()
     * picks up changes. You can swap this for a custom /api/auth/me
     * call later if you want something lighter.
     */
    const refresh = async () => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    };

    const hasRole: AuthContextValue["hasRole"] = (...roles) => {
      if (!user) return false;
      return roles.includes(user.role);
    };

    const hasPermission: AuthContextValue["hasPermission"] = (
      ...perms
    ) => {
      if (!user || !user.permissions) return false;
      return perms.some((p) => user!.permissions!.includes(p));
    };

    return {
      status: authStatus,
      user,
      isAuthenticated,
      isLoading,
      signInWithGithub,
      signOut,
      refresh,
      hasRole,
      hasPermission,
      raw: {
        signIn: nextSignIn,
        signOut: nextSignOut,
      },
    };
  }, [session, status]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 *
 * Access auth status, user, and helpers.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
