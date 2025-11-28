"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUser, AdminUserFormValues } from "@/features/admin/users/types/types";

interface UseAdminUsersResult {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  createUser: (values: AdminUserFormValues) => Promise<void>;
  updateUser: (id: string, values: AdminUserFormValues) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          (body && (body.error || body.message)) ||
          `Failed to load users (status ${res.status})`;
        throw new Error(message);
      }

      const data = (await res.json()) as AdminUser[];
      setUsers(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const reload = useCallback(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (values: AdminUserFormValues) => {
      setError(null);

      const payload: Partial<AdminUserFormValues> = { ...values };
      if (!payload.password) {
        delete payload.password;
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          (body && (body.error || body.message)) ||
          `Failed to create user (status ${res.status})`;
        throw new Error(message);
      }

      await fetchUsers();
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (id: string, values: AdminUserFormValues) => {
      setError(null);

      const payload: Partial<AdminUserFormValues> = { ...values };
      // Do not send password if it's an empty string → leave password unchanged.
      if (!payload.password) {
        delete payload.password;
      }

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          (body && (body.error || body.message)) ||
          `Failed to update user (status ${res.status})`;
        throw new Error(message);
      }

      await fetchUsers();
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setError(null);

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          (body && (body.error || body.message)) ||
          `Failed to delete user (status ${res.status})`;
        throw new Error(message);
      }

      await fetchUsers();
    },
    [fetchUsers],
  );

  return {
    users,
    isLoading,
    error,
    reload,
    createUser,
    updateUser,
    deleteUser,
  };
}