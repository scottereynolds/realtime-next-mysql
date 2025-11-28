// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

// Keep this in sync with however you conceptually use roles.
type AppRole = "user" | "administrator";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        // Let Prisma infer the correct User type.
        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          return null;
        }

        // Use `any` here to avoid NextAuth type collisions.
        const authUser = dbUser as any;

        if (!authUser.passwordHash) {
          // No local password set → reject credentials login
          return null;
        }

        const valid = await bcrypt.compare(password, authUser.passwordHash);
        if (!valid) {
          return null;
        }

        // This object becomes `user` in the JWT callback on initial sign-in
        return {
          id: String(dbUser.id),
          name: dbUser.name,
          email: dbUser.email,
          // If your DB actually has a role, we’ll pass it through;
          // otherwise fall back to "user".
          role: (authUser.role ?? "user") as AppRole,
        };
      },
    }),

    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // When we first sign in with credentials, `user` carries the role we returned.
      if (user && (user as any).role) {
        (token as any).role = (user as any).role as AppRole;
      }

      // Fallback so we always have *some* role value
      if (!(token as any).role) {
        (token as any).role = "user" as AppRole;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role =
          ((token as any).role as AppRole | undefined) ?? "user";
      }

      return session;
    },
  },
});
