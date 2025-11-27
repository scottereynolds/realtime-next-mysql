// src/types/auth.ts

import type { User as PrismaUser } from "@prisma/client";

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
}

/**
 * Role types – keep these in sync with your backend auth logic.
 */
export type AuthRole =
  | "user"
  | "admin";

/**
 * Account lifecycle status – you’re already using these
 * in your other project.
 */
export type AccountStatus =
  | "active"
  | "inactive";

/**
 * If you need fine-grained permissions instead of just roles.
 * Optional: expand as your app grows.
 */
export type PermissionKey =
  | "messages:read"
  | "messages:create"
  | "messages:moderate"
  | "admin:manage_org"
  | "admin:manage_users"
  | "admin:manage_apps";

/**
 * Frontend-friendly view of the current auth state.
 * Great for an AuthContext or `useAuth()` hook.
 */
export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * What your AuthContext exposes.
 * You can adapt this to match your actual implementation.
 */
export interface AuthContextValue extends AuthState {
  /**
   * Call to refresh the session (e.g., re-fetch /api/auth/me).
   */
  refresh: () => Promise<void>;

  /**
   * Optional helpers to check roles/permissions.
   */
  hasRole: (...roles: AuthRole[]) => boolean;
  hasPermission: (...perms: PermissionKey[]) => boolean;
}

// ---- Mappers to/from Prisma / NextAuth ----

/**
 * Useful helper type if you want a typed map from Prisma `User`
 * to your frontend-safe `AppUser`.
 */
export type PrismaUserSource = PrismaUser;
