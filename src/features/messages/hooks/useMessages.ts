"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, CreateMessagePayload } from "@/types/message";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useLoading } from "@/contexts/LoadingContext";
import { apiGet, apiPost, apiDelete, ApiError } from "@/lib/apiClient";

/**
 * Load the list of messages.
 */
export function useMessages() {
  return useQuery<Message[], ApiError>({
    queryKey: ["messages"],
    queryFn: () => apiGet<Message[]>("/api/messages"),
  });
}

/**
 * Create a new message and broadcast via socket if provided.
 */
export function useCreateMessage(socket?: any) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();

  return useMutation<Message, ApiError, CreateMessagePayload>({
    mutationFn: async (data) => {
      startLoading("api");
      try {
        return await apiPost<Message, CreateMessagePayload>(
          "/api/messages",
          data,
        );
      } finally {
        stopLoading("api");
      }
    },
    onSuccess: (createdMessage) => {
      void queryClient.invalidateQueries({ queryKey: ["messages"] });

      if (socket && typeof socket.emit === "function") {
        socket.emit("message:created", createdMessage);
      }

      showSnackbar({
        message: "Message sent",
        variant: "success",
      });
    },
    onError: (error) => {
      const fallback = "Failed to send message";
      showSnackbar({
        message: error?.message || fallback,
        variant: "error",
      });
    },
  });
}

/**
 * Delete a message and broadcast via socket if provided.
 */
export function useDeleteMessage(socket?: any) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoading();

  return useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      startLoading("api");
      try {
        return await apiDelete<void>(`/api/messages/${id}`);
      } finally {
        stopLoading("api");
      }
    },
    onSuccess: (_data, id) => {
      // Update this client's list
      void queryClient.invalidateQueries({ queryKey: ["messages"] });

      // Broadcast to others
      if (socket && typeof socket.emit === "function") {
        socket.emit("message:deleted", { id });
      }

      showSnackbar({
        message: "Message deleted",
        variant: "success",
      });
    },
    onError: (error) => {
      showSnackbar({
        message: error?.message || "Failed to delete message",
        variant: "error",
      });
    },
  });
}
