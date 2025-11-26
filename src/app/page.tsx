"use client";

import { AuthBar } from "@/components/AuthBar";
import { MessageTable } from "@/components/MessageTable";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <main style={{ padding: "2rem" }}>
      <AuthBar />

      <h1 style={{ marginBottom: "1rem" }}>Realtime Messages Demo</h1>

      {status === "loading" && (
        <div style={{ marginBottom: "1rem" }}>Checking session…</div>
      )}

      {!session && status !== "loading" && (
        <div style={{ marginBottom: "1rem" }}>
          Please sign in to view and post messages.
        </div>
      )}

      {session && (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Signed in as{" "}
            <strong>{session.user?.email ?? session.user?.name}</strong>
          </p>
          <MessageTable />
        </>
      )}
    </main>
  );
}
