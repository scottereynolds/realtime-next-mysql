"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import AdminUsersTable from "@/features/admin/users/components/AdminUsersTable";
import AdminUserFormModal from "@/features/admin/users/components/AdminUserFormModal";
import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers";
import type {
  AdminUser,
  AdminUserFormMode,
  AdminUserFormValues,
} from "@/features/admin/users/types/types";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useLoading } from "@/contexts/LoadingContext";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";

export default function AdminUsersClient() {
  const { users, isLoading, error, createUser, updateUser, deleteUser } =
    useAdminUsers();

  const { data: session, update: updateSession } = useSession();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<AdminUserFormMode>("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId =
    (session?.user as any)?.realUserId ?? (session?.user as any)?.id ?? null;
  const isImpersonating = Boolean(
    (session?.user as any)?.isImpersonating &&
      (session?.user as any)?.impersonatedUserId,
  );
  const effectiveEmail = session?.user?.email ?? "";

  const handleCreateClick = () => {
    setMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user: AdminUser) => {
    setMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (user: AdminUser) => {
    startLoading();
    try {
      await deleteUser(user.id);
      showSnackbar({
        message: `User "${user.email}" deleted.`,
        variant: "success",
        autoHideDuration: 4000,
      });
    } catch (err: any) {
      console.error("Failed to delete user", err);
      showSnackbar({
        message: err?.message ?? "Failed to delete user.",
        variant: "error",
        autoHideDuration: 6000,
      });
    } finally {
      stopLoading();
    }
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (values: AdminUserFormValues) => {
    setIsSubmitting(true);
    startLoading();
    try {
      if (mode === "create") {
        await createUser(values);
        showSnackbar({
          message: `User "${values.email}" created.`,
          variant: "success",
          autoHideDuration: 4000,
        });
      } else if (mode === "edit" && selectedUser) {
        await updateUser(selectedUser.id, values);
        showSnackbar({
          message: `User "${values.email}" updated.`,
          variant: "success",
          autoHideDuration: 4000,
        });
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Failed to save user", err);
      showSnackbar({
        message: err?.message ?? "Failed to save user.",
        variant: "error",
        autoHideDuration: 6000,
      });
    } finally {
      stopLoading();
      setIsSubmitting(false);
    }
  };

  const handleImpersonate = async (user: AdminUser) => {
    try {
      await updateSession({
        impersonateUserId: user.id,
      });
      showSnackbar({
        message: `Now impersonating "${user.email}".`,
        variant: "info",
        autoHideDuration: 4000,
      });
    } catch (err: any) {
      console.error("Failed to start impersonation", err);
      showSnackbar({
        message: err?.message ?? "Failed to start impersonation.",
        variant: "error",
        autoHideDuration: 6000,
      });
    }
  };

  const handleStopImpersonating = async () => {
    try {
      await updateSession({
        stopImpersonating: true,
      });
      showSnackbar({
        message: "Stopped impersonating.",
        variant: "info",
        autoHideDuration: 4000,
      });
    } catch (err: any) {
      console.error("Failed to stop impersonation", err);
      showSnackbar({
        message: err?.message ?? "Failed to stop impersonation.",
        variant: "error",
        autoHideDuration: 6000,
      });
    }
  };

  const initialValues: AdminUserFormValues | undefined =
    mode === "edit" && selectedUser
      ? {
          name: selectedUser.name ?? "",
          email: selectedUser.email,
          role: selectedUser.role,
          password: "",
        }
      : undefined;

  return (
    <div className="space-y-4">
      {isImpersonating && (
        <div className="flex items-center justify-between rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span>
            Impersonating <strong>{effectiveEmail}</strong>
          </span>
          <BaseButton
            size="small"
            variant="outlined"
            color="warning"
            onClick={handleStopImpersonating}
          >
            Stop impersonating
          </BaseButton>
        </div>
      )}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <AdminUsersTable
        users={users}
        isLoading={isLoading}
        onCreate={handleCreateClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onImpersonate={handleImpersonate}
        currentUserId={currentUserId}
      />

      <AdminUserFormModal
        open={isModalOpen}
        mode={mode}
        initialValues={initialValues}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
