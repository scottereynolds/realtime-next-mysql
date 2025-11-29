// src/features/admin/messages/components/AdminMessagesClient.tsx
"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BaseBox from "@/components/MUI/Layout/BaseBox";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useLoading } from "@/contexts/LoadingContext";

import { AdminMessagesTable } from "./AdminMessagesTable";
import type {
  AdminMessage,
  AdminMessagesListResponse,
} from "../types/adminMessagesTypes";

const QUERY_KEY = ["adminMessages"];

async function fetchAdminMessages(): Promise<AdminMessagesListResponse> {
  const params = new URLSearchParams();
  params.set("take", "500"); // plenty; MRT will handle client-side paging

  const res = await fetch(`/api/admin/messages?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load messages");
  }

  return res.json();
}

export default function AdminMessagesClient() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchMessages,
    error,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => fetchAdminMessages(),
  });

  const messages: AdminMessage[] = useMemo(
    () => data?.items ?? [],
    [data?.items],
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete message");
      }
    },
    onMutate: () => {
      startLoading();
    },
    onError: (err: any) => {
      console.error("Failed to delete message", err);
      showSnackbar({
        message: err?.message ?? "Failed to delete message.",
        variant: "error",
        autoHideDuration: 6000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      showSnackbar({
        message: "Message deleted.",
        variant: "success",
        autoHideDuration: 4000,
      });
    },
    onSettled: () => {
      stopLoading();
    },
  });

  const handleDeleteMessage = (message: AdminMessage) => {
    deleteMutation.mutate(message.id);
  };

  return (
    <BaseBox className="p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Message Management
        </h1>
        <p className="text-sm text-slate-500">
          Administrators can review and remove messages across all conversations
          in the system here.
        </p>
      </header>

      <BaseBox className="space-y-4">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {(error as any)?.message ?? "Failed to load messages."}
          </div>
        )}

        <AdminMessagesTable
          data={messages}
          isLoading={isLoading || isRefetching}
          isRefetching={isRefetching}
          onDeleteMessage={handleDeleteMessage}
          onRefresh={() => void refetchMessages()}
        />
      </BaseBox>
    </BaseBox>
  );
}
