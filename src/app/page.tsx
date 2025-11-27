"use client";

import { useSession } from "next-auth/react";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";
import { BaseAlert } from "@/components/MUI/Feedback/BaseAlert";
import {
  BaseCard,
  BaseCardContent,
  BaseCardHeader,
} from "@/components/MUI/Surface/BaseCard";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <BaseCard>
      <BaseCardHeader title="Welcome" />
      <BaseCardContent>
        <BaseTypography variant="body1" sx={{ mb: 2 }}>
          This is the Realtime Next + MySQL starter demo. Use the navigation on
          the left to open the <strong>Messages</strong> demo and try out
          realtime updates.
        </BaseTypography>

        {status === "loading" && (
          <BaseTypography variant="body2">Checking session…</BaseTypography>
        )}

        {status !== "loading" && !session && (
          <BaseAlert severity="info" sx={{ mt: 1 }}>
            Sign in from the header to access protected demos.
          </BaseAlert>
        )}

        {session && (
          <BaseTypography variant="body2" sx={{ mt: 1 }}>
            Signed in as{" "}
            <strong>{session.user?.email ?? session.user?.name}</strong>. Open{" "}
            <strong>Messages</strong> from the sidebar to see the realtime
            demo.
          </BaseTypography>
        )}
      </BaseCardContent>
    </BaseCard>
  );
}
