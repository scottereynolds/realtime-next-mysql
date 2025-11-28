// src/types/auth.ts

// Keep this as a simple union, independent of next-auth internals.
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "user" | "administrator";
}

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;

  raw: {
    signIn: typeof import("next-auth/react")["signIn"];
    signOut: typeof import("next-auth/react")["signOut"];
  };
}
