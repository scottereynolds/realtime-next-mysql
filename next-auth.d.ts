import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;

      /**
       * The real, non-impersonated user id and role.
       * These stay constant even while impersonating.
       */
      realUserId: string;
      realUserRole: Role;

      /**
       * When impersonating another user:
       *  - `impersonatedUserId` is that user's id
       *  - `isImpersonating` is true
       * Otherwise:
       *  - `impersonatedUserId` is null
       *  - `isImpersonating` is false
       */
      impersonatedUserId: string | null;
      isImpersonating: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Effective user
    userId?: string;
    role?: Role;
    email?: string | null;
    name?: string | null;

    // Real (non-impersonated) user identity
    realUserId?: string;
    realUserRole?: Role;

    // Impersonation state
    impersonatedUserId?: string | null;
  }
}
