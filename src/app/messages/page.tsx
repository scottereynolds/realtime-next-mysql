"use client";

import { useSession } from "next-auth/react";
import { MessageShell } from "@/features/messages/components/MessageShell";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";
import { BaseAlert } from "@/components/MUI/Feedback/BaseAlert";

export default function MessagesPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <BaseTypography>Checking session…</BaseTypography>;
  }

  if (!session) {
    return (
      <BaseAlert severity="info">
        Please sign in to view and post messages.
      </BaseAlert>
    );
  }

  return (
    <>
      <BaseTypography variant="h4" sx={{ mb: 2 }}>
        Realtime Messages Demo
      </BaseTypography>

      <MessageShell />
    </>
  );
}
