"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import type { Message } from "@prisma/client";
import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

export default function HomePage() {
  const { data, isLoading, isError } = useMessages();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const createMessage = useCreateMessage(socket);

  const [author, setAuthor] = useState("Scott");
  const [content, setContent] = useState("");

  // Listen for WS events and invalidate query when others create messages
  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    socket.on("message:created", handler);
    return () => {
      socket.off("message:created", handler);
    };
  }, [socket, queryClient]);

  const columns = useMemo<MRT_ColumnDef<Message>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "author",
        header: "Author",
      },
      {
        accessorKey: "content",
        header: "Content",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleString(),
      },
    ],
    []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMessage.mutate(
      { author: author || "Anonymous", content },
      {
        onSuccess: () => setContent(""),
      }
    );
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Realtime Messages Demo</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Message content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" disabled={createMessage.isPending}>
          {createMessage.isPending ? "Saving..." : "Add Message"}
        </button>
      </form>

      {isLoading && <div>Loading messages…</div>}
      {isError && <div>Error loading messages.</div>}

      {data && (
        <MaterialReactTable
          columns={columns}
          data={data}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableSorting
        />
      )}
    </main>
  );
}
