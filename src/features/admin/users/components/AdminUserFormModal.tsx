"use client";

import { useEffect, useState } from "react";

import BaseModal from "@/components/MUI/Layout/BaseModal";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseTextField } from "@/components/MUI/Inputs/BaseTextField";
import { BaseSelect } from "@/components/MUI/Inputs/BaseSelect";
import type {
  AdminRole,
  AdminUserFormMode,
  AdminUserFormValues,
} from "@/features/admin/users/types/adminUserTypes";

interface AdminUserFormModalProps {
  open: boolean;
  mode: AdminUserFormMode;
  initialValues?: AdminUserFormValues;
  onClose: () => void;
  onSubmit: (values: AdminUserFormValues) => Promise<void> | void;
  isSubmitting: boolean;
}

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "administrator", label: "Administrator" },
];

const EMPTY_FORM: AdminUserFormValues = {
  name: "",
  email: "",
  role: "user",
  password: "",
};

export default function AdminUserFormModal({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
}: AdminUserFormModalProps) {
  const [values, setValues] = useState<AdminUserFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      setValues({
        ...initialValues,
        password: "",
      });
    } else {
      setValues(EMPTY_FORM);
    }
  }, [open, mode, initialValues]);

  const handleChange =
    (field: keyof AdminUserFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      const value = event.target.value;
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // Loosened type to align with MUI Select's union type
  const handleRoleChange = (event: any) => {
    const value = event.target.value as AdminRole;
    setValues((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (mode === "create" && !values.password) {
      alert("Password is required when creating a user.");
      return;
    }

    await onSubmit(values);
  };

  const title = mode === "create" ? "Create User" : "Edit User";

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      // 🔥 Force a consistent “nice wide” width for both create + edit
      maxWidth={720}
      sx={{ width: 720 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">
            {mode === "create"
              ? "Create a new user and assign a role."
              : "Update user details and role. Leave password blank to keep the existing password."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <BaseTextField
            label="Name"
            value={values.name}
            onChange={handleChange("name")}
            fullWidth
          />
          <BaseTextField
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            required
            fullWidth
          />

          <BaseSelect
            label="Role"
            value={values.role}
            onChange={handleRoleChange}
            fullWidth
            native
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </BaseSelect>

          <BaseTextField
            label={
              mode === "create"
                ? "Password"
                : "Password (leave blank to keep existing)"
            }
            type="password"
            value={values.password}
            onChange={handleChange("password")}
            fullWidth
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <BaseButton
            variant="outlined"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  );
}
