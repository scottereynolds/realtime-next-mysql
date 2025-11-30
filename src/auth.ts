// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

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
          typeof credentials?.email === "string"
            ? credentials.email.trim()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          return null;
        }

        const authUser = dbUser as any;

        if (!authUser.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, authUser.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: String(dbUser.id),
          name: dbUser.name,
          email: dbUser.email,
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
    // JWT = single source of truth (for auth() and useSession().update)
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign-in (credentials or GitHub)
      if (user) {
        let authUser = user as any;

        // 🔄 Normalize GitHub users to a Prisma User row by email
        if (account?.provider === "github") {
          const email = authUser.email as string | undefined;

          if (email) {
            // Try to find an existing Prisma user for this email
            let dbUser = await prisma.user.findUnique({
              where: { email },
            });

            // Optionally create if missing (only if that makes sense for you)
            if (!dbUser) {
              dbUser = await prisma.user.create({
                data: {
                  email,
                  name: authUser.name ?? null,
                  image: authUser.image ?? null,
                  // If your Prisma schema has a `role` with default "user",
                  // you don't need to set it explicitly here.
                },
              });
            }

            authUser = dbUser as any;
          }
        }

        // For credentials users, `authUser` is already the Prisma row you return
        const userId = String(authUser.id);
        const role: AppRole = (authUser.role ?? "user") as AppRole;

        (token as any).userId = userId;
        (token as any).role = role;
        (token as any).email = authUser.email;
        (token as any).name = authUser.name;

        // Real (non-impersonated) user identity
        if (!(token as any).realUserId) {
          (token as any).realUserId = userId;
        }
        if (!(token as any).realUserRole) {
          (token as any).realUserRole = role;
        }

        // Fresh login → clear any old impersonation
        (token as any).impersonatedUserId = null;
      }

      // Handle impersonation via useSession().update(...)
      if (trigger === "update" && session) {
        const payload = session as any;

        // Start or switch impersonation
        if (payload.impersonateUserId) {
          const realRole =
            ((token as any).realUserRole as AppRole | undefined) ??
            ((token as any).role as AppRole | undefined) ??
            "user";

          // Only *real* admins can impersonate
          if (realRole !== "administrator") {
            return token;
          }

          const target = await prisma.user.findUnique({
            where: { id: String(payload.impersonateUserId) },
          });

          if (!target) {
            return token;
          }

          (token as any).impersonatedUserId = String(target.id);
          (token as any).userId = String(target.id);
          (token as any).role = (target.role ?? "user") as AppRole;
          (token as any).email = target.email;
          (token as any).name = target.name;
        }

        // Stop impersonating → restore real identity
        if (payload.stopImpersonating) {
          const realUserId = (token as any).realUserId;
          const realUserRole = (token as any).realUserRole as
            | AppRole
            | undefined;

          (token as any).impersonatedUserId = null;

          if (realUserId) {
            (token as any).userId = realUserId;
          }
          if (realUserRole) {
            (token as any).role = realUserRole;
          }
        }
      }

      // Backstops
      if (!(token as any).role) {
        (token as any).role = "user" as AppRole;
      }
      if (!(token as any).userId && token.sub) {
        (token as any).userId = token.sub;
      }
      if (!(token as any).realUserId && (token as any).userId) {
        (token as any).realUserId = (token as any).userId;
      }
      if (!(token as any).realUserRole && (token as any).role) {
        (token as any).realUserRole = (token as any).role;
      }

      return token;
    },

    // What the client sees via useSession()
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id =
          (token as any).userId ?? token.sub ?? (session.user as any).id;

        (session.user as any).role =
          ((token as any).role as AppRole | undefined) ?? "user";

        (session.user as any).realUserId =
          (token as any).realUserId ?? (session.user as any).id;
        (session.user as any).realUserRole =
          ((token as any).realUserRole as AppRole | undefined) ??
          (session.user as any).role;

        (session.user as any).impersonatedUserId =
          (token as any).impersonatedUserId ?? null;
        (session.user as any).isImpersonating = Boolean(
          (token as any).impersonatedUserId,
        );
      }

      return session;
    },
  },
});
