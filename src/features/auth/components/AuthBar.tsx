"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ChatLauncher from "@/features/messages/components/ChatLauncher";

export function AuthBar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-end px-2 text-xs text-slate-400">
        Checking session…
      </div>
    );
  }

  // Not authenticated: show Login / Register + GitHub option
  if (!session) {
    return (
      <div className="flex items-center justify-end gap-2 px-2">
        <Link href="/login">
          <button className="rounded border border-slate-500 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800">
            Log in
          </button>
        </Link>

        <Link href="/register">
          <button className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
            Register
          </button>
        </Link>

        <button
          className="hidden md:inline-flex items-center rounded border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  // Authenticated: minimal info + sign out + chat icon
  return (
    <div className="flex items-center justify-end gap-3 px-2 text-xs text-slate-200">
      {/* Chat icon (unread badge + dropdown window) */}
      <ChatLauncher />

      <span className="hidden sm:inline">
        {session.user?.name ?? session.user?.email ?? "Signed in"}
      </span>
      <button
        className="rounded border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </button>
    </div>
  );
}
