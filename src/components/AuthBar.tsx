"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthBar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-end p-2 text-sm text-gray-500">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-end p-2">
        <button
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-3 p-2 text-sm">
      <span>Signed in as {session.user?.email ?? session.user?.name}</span>
      <button
        className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
