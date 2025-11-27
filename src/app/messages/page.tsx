// app/messages/page.tsx
import { MessageShell } from "@/features/messages/components/MessageShell";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

export default function MessagesPage() {
  return (
    <RequireAuth>
      <>
        <BaseTypography variant="h4" sx={{ mb: 2 }}>
          Realtime Messages Demo
        </BaseTypography>

        <MessageShell />
      </>
    </RequireAuth>
  );
}
