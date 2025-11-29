"use client";

import { useEffect, useMemo, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Chip from "@mui/material/Chip";

import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseMaterialReactTable } from "@/components/MRT/BaseMaterialReactTable";
import type { AdminUser } from "@/features/admin/users/types/adminUserTypes";
import { useDialog } from "@/contexts/DialogContext";
import { BaseStack } from "@/components/MUI/Layout/BaseStack";

interface AdminUsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onImpersonate?: (user: AdminUser) => void;
  currentUserId: string | null;
}

export default function AdminUsersTable({
  users,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onImpersonate,
  currentUserId,
}: AdminUsersTableProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { openDialog, closeDialog } = useDialog();

  const adminCount = useMemo(
    () => users.filter((u) => u.role === "administrator").length,
    [users],
  );

  const handleRequestDelete = (user: AdminUser) => {
    openDialog({
      title: "Delete user",
      size: "sm",
      content: (
        <BaseStack spacing={2}>
          <p>
            Are you sure you want to delete this user{" "}
            {user.name && (
              <>
                <strong>{user.name}</strong>{" "}
              </>
            )}
            (<strong>{user.email}</strong>)?
          </p>
          <p className="text-sm text-slate-500">
            This action cannot be undone.
          </p>
          <BaseStack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <BaseButton variant="outlined" onClick={() => closeDialog()}>
              Cancel
            </BaseButton>
            <BaseButton
              variant="contained"
              color="error"
              onClick={() => {
                onDelete(user);
                closeDialog();
              }}
            >
              Delete
            </BaseButton>
          </BaseStack>
        </BaseStack>
      ),
    });
  };

  const columns = useMemo<MRT_ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => row.original.name ?? "—",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ row }) => {
          const role = row.original.role;
          const label = role === "administrator" ? "Administrator" : "User";
          const color = role === "administrator" ? "primary" : "default";
          const variant = role === "administrator" ? "filled" : "outlined";

          return <Chip label={label} size="small" color={color} variant={variant} />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const user = row.original;
          const isSelf =
            currentUserId != null && String(user.id) === String(currentUserId);
          const isLastAdmin =
            user.role === "administrator" && adminCount <= 1;
          const disableDelete = isSelf || isLastAdmin;

          return (
            <div className="flex items-center justify-end gap-1">
              {onImpersonate && (
                <IconButton
                  size="small"
                  aria-label={`Impersonate user ${user.email}`}
                  onClick={() => onImpersonate(user)}
                  disabled={isSelf}
                >
                  <PersonSearchIcon fontSize="small" />
                </IconButton>
              )}

              <IconButton
                size="small"
                aria-label={`Edit user ${user.email}`}
                onClick={() => onEdit(user)}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                aria-label={`Delete user ${user.email}`}
                onClick={() => handleRequestDelete(user)}
                disabled={disableDelete}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          );
        },
      },
    ],
    [onEdit, onImpersonate, adminCount, currentUserId],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Users</h2>
        <BaseButton
          variant="contained"
          color="primary"
          size="small"
          onClick={onCreate}
        >
          New User
        </BaseButton>
      </div>

      {isClient && (
        <BaseMaterialReactTable
          columns={columns}
          data={users}
          state={{ isLoading }}
          enableEditing={false}
          enableFullScreenToggle={false}
        />
      )}
    </div>
  );
}
