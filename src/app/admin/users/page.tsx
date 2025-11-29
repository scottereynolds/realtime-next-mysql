// src/app/admin/users/page.tsx
import { requireAdmin } from "@/lib/auth-helpers";
import AdminUsersClient from "@/features/admin/users/components/AdminUsersClient";

export default async function AdminUsersPage() {
  // This guarantees only administrators can render this page.
  await requireAdmin();

  // Let the feature client own all layout and UI.
  return <AdminUsersClient />;
}
