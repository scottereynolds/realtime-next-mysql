// src/types/auth.ts

import type { User as PrismaUser } from "@prisma/client";

/**
 * Role types – keep these in sync with your backend auth logic.
 */
export type AuthRole = "user" | "admin";

/**
 * Account lifecycle status.
 */
export type AccountStatus = "active" | "inactive";

/**
 * Fine-grained permissions.
 */
export type PermissionKey =
  | "messages:read"
  | "messages:create"
  | "messages:moderate"
  | "admin:manage_org"
  | "admin:manage_users"
  | "admin:manage_apps";

/**
 * Narrowed user type exposed to the frontend / session.
 * Keeps sensitive fields out of client code.
 */
export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  /**
   * Username, handle, or display identifier.
   */
  username?: string | null;

  role: AuthRole;
  status: AccountStatus;

  // Extra app-specific flags (expand as needed)
  isSuperAdmin?: boolean;
  isOrgAdmin?: boolean;

  /**
   * Optional fine-grained permissions.
   */
  permissions?: PermissionKey[];
}

/**
 * Basic auth state used by context.
 */
export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Overall session status from NextAuth.
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * What your AuthContext exposes.
 */
export interface AuthContextValue extends AuthState {
  /** NextAuth-style status */
  status: AuthStatus;

  /** High-level helpers */
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;

  /**
   * Call to refresh the session (e.g., re-fetch /api/auth/me).
   */
  refresh: () => Promise<void>;

  /**
   * Optional helpers to check roles/permissions.
   */
  hasRole: (...roles: AuthRole[]) => boolean;
  hasPermission: (...perms: PermissionKey[]) => boolean;

  /** Low-level escape hatch if you ever need custom providers/options */
  raw: {
    signIn: typeof import("next-auth/react")["signIn"];
    signOut: typeof import("next-auth/react")["signOut"];
  };
}

// ---- Mappers to/from Prisma / NextAuth ----

/**
 * Useful helper type if you want a typed map from Prisma `User`
 * to your frontend-safe `AppUser`.
 */
export type PrismaUserSource = PrismaUser;
