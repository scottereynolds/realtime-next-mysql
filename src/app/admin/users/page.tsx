import { requireAdmin } from "@/lib/auth-helpers";
import AdminUsersClient from "@/features/admin/users/components/AdminUsersClient";

export default async function AdminUsersPage() {
  // This guarantees only administrators can render this page.
  // If `requireAdmin` throws or redirects on failure, this will never reach the UI.
  await requireAdmin();

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-slate-500">
          Administrators can view, create, edit, and remove users from the system here.
        </p>
      </header>

      {/* The feature client component (we’ll implement this next). */}
      <AdminUsersClient />
    </div>
  );
}
