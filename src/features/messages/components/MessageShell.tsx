"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { BaseStack } from "@/components/MUI/Layout/BaseStack";
import { MessageForm } from "@/features/messages/components/MessageForm";
import { MessagesTable } from "@/features/messages/components/MessageTable";
import {
  useMessages,
  useCreateMessage,
  useDeleteMessage,
} from "@/features/messages/hooks/useMessages";
import { useSocket } from "@/hooks/useSocket";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { Message } from "@/types/message";

export function MessageShell() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, isError } = useMessages();
  const createMessage = useCreateMessage(socket);
  const deleteMessage = useDeleteMessage(socket);

  // Listen for create/delete events from *other* clients
  useEffect(() => {
    if (!socket) return;

    const handleCreated = () => {
      // simplest: just refetch on create
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      showSnackbar({ message: "New message received", variant: "info" });
    };

    const handleDeleted = (payload: { id: number }) => {
      // Surgically remove the deleted message from cache
      queryClient.setQueryData<Message[] | undefined>(
        ["messages"],
        (old) => {
          if (!old) return old;
          return old.filter((m) => m.id === undefined || m.id !== payload.id);
        },
      );

      // Optional: also invalidate to stay in sync with server
      // queryClient.invalidateQueries({ queryKey: ["messages"] });

      showSnackbar({ message: "Message deleted", variant: "info" });
    };

    socket.on("message:created", handleCreated);
    socket.on("message:deleted", handleDeleted);

    return () => {
      socket.off("message:created", handleCreated);
      socket.off("message:deleted", handleDeleted);
    };
  }, [socket, queryClient, showSnackbar]);

  const handleCreate = (values: { author: string; content: string }) => {
    createMessage.mutate({
      author: values.author || "Anonymous",
      content: values.content,
    });
  };

  const handleDelete = (id: number) => {
    deleteMessage.mutate(id);
  };

  return (
    <BaseStack spacing={2}>
      <MessageForm
        isSubmitting={createMessage.isPending}
        onSubmit={handleCreate}
      />
      <MessagesTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onDelete={handleDelete}
      />
    </BaseStack>
  );
}
