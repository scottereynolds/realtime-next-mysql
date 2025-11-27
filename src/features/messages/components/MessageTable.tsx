// src/features/messages/components/MessageTable.tsx
"use client";

import { useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import type { Message } from "@prisma/client";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { BaseMaterialReactTable } from "@/components/MRT/BaseMaterialReactTable";
import {
  BaseCard,
  BaseCardContent,
} from "@/components/MUI/Surface/BaseCard";
import { BaseLinearProgress } from "@/components/MUI/Feedback/BaseProgress";
import { BaseAlert } from "@/components/MUI/Feedback/BaseAlert";
import { BaseStack } from "@/components/MUI/Layout/BaseStack";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";

import { useDialog } from "@/contexts/DialogContext";

type MessagesTableProps = {
  data: Message[] | undefined;
  isLoading: boolean;
  isError: boolean;
  /** Called after the user confirms they want to delete a message */
  onDelete: (id: number) => void;
};

export function MessagesTable({
  data,
  isLoading,
  isError,
  onDelete,
}: MessagesTableProps) {
  const { openDialog, closeDialog } = useDialog();

  const handleRequestDelete = (message: Message) => {
    openDialog({
      title: "Delete message",
      size: "sm",
      content: (
        <BaseStack spacing={2}>
          <p>
            Are you sure you want to delete this message from{" "}
            <strong>{message.author}</strong>?
          </p>
          <p className="text-sm text-slate-500">
            &ldquo;{message.content}&rdquo;
          </p>
          <BaseStack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <BaseButton
              variant="outlined"
              onClick={() => closeDialog()}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="contained"
              color="error"
              onClick={() => {
                onDelete(message.id);
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
      {
        id: "actions",
        header: "Actions",
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <IconButton
            aria-label="Delete message"
            color="error"
            size="small"
            onClick={() => handleRequestDelete(row.original)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleRequestDelete],
  );

  return (
    <BaseCard>
      <BaseCardContent>
        {isLoading && (
          <div className="mb-2">
            <BaseLinearProgress />
          </div>
        )}
        {isError && (
          <div className="mb-2">
            <BaseAlert severity="error">
              Error loading messages.
            </BaseAlert>
          </div>
        )}

        {data && (
          <BaseMaterialReactTable<Message>
            columns={columns}
            data={data}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableSorting
          />
        )}
      </BaseCardContent>
    </BaseCard>
  );
}
