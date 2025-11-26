import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub, // uses AUTH_GITHUB_ID / AUTH_GITHUB_SECRET from .env
  ],
  // You can customize pages, callbacks, etc. later:
  // pages: { signIn: "/auth/signin" },
});
