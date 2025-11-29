// src/features/admin/messages/components/AdminMessagesTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";

import { BaseMaterialReactTable } from "@/components/MRT/BaseMaterialReactTable";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import BaseIconButton from "@/components/MUI/Inputs/BaseIconButton";
import { BaseTooltip } from "@/components/MUI/DataDisplay/BaseTooltip";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseStack } from "@/components/MUI/Layout/BaseStack";
import { useDialog } from "@/contexts/DialogContext";

import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import type { AdminMessage } from "../types/adminMessagesTypes";

export interface AdminMessagesTableProps {
  data: AdminMessage[];
  isLoading: boolean;
  isRefetching: boolean;
  onDeleteMessage: (message: AdminMessage) => void;
  onRefresh: () => void;
}

export function AdminMessagesTable({
  data,
  isLoading,
  isRefetching,
  onDeleteMessage,
  onRefresh,
}: AdminMessagesTableProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { openDialog, closeDialog } = useDialog();

  const handleRequestDelete = (message: AdminMessage) => {
    const snippet =
      message.content.length > 200
        ? `${message.content.slice(0, 200)}…`
        : message.content;

    openDialog({
    title: "Delete message",
    size: "sm",
    content: (
        <BaseStack spacing={2}>
        <p className="text-sm">
            Are you sure you want to delete this message?
        </p>

        {/* Message preview as plain text */}
        <p>
            {snippet || "(empty message)"}
        </p>

        <p className="text-xs text-slate-500">
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
                onDeleteMessage(message);
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

  const columns = useMemo<MRT_ColumnDef<AdminMessage>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        size: 160,
        Cell: ({ row }) => {
          const value = row.original.createdAt;
          const d = new Date(value);
          return (
            <span className="text-xs text-slate-700">
              {d.toLocaleString()}
            </span>
          );
        },
      },
      {
        id: "conversation",
        header: "Conversation",
        size: 220,
        accessorFn: (row) => {
          const convo = row.conversation;
          if (!convo) return "N/A";
          return convo.title || `Conversation #${convo.id} (${convo.type})`;
        },
        Cell: ({ row }) => {
          const convo = row.original.conversation;
          if (!convo) {
            return (
              <span className="text-xs text-slate-400">
                N/A
              </span>
            );
          }

          const title =
            convo.title || `Conversation #${convo.id} (${convo.type})`;

          return (
            <BaseBox className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {title}
              </span>
            </BaseBox>
          );
        },
      },
      {
        id: "sender",
        header: "Sender",
        size: 220,
        accessorFn: (row) => {
          const sender = row.sender;
          if (!sender) return "Unknown";
          return sender.name || sender.email || sender.id;
        },
        Cell: ({ row }) => {
          const sender = row.original.sender;
          if (!sender) {
            return (
              <span className="text-xs text-slate-400">
                Unknown
              </span>
            );
          }

          const label = sender.name || sender.email || sender.id;

          return (
            <BaseBox className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {label}
              </span>
              {sender.email && (
                <span className="text-[11px] text-slate-500 truncate">
                  {sender.email}
                </span>
              )}
            </BaseBox>
          );
        },
      },
      {
        accessorKey: "content",
        header: "Content",
        size: 400,
        Cell: ({ row }) => (
          <span className="text-xs text-slate-800 line-clamp-2">
            {row.original.content}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-2">
      {/* Header (mirrors Users table styling) */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Messages</h2>
        <BaseTooltip title="Refresh">
          <span>
            <BaseIconButton
              size="small"
              onClick={onRefresh}
              disabled={isRefetching || isLoading}
            >
              <RefreshIcon fontSize="small" />
            </BaseIconButton>
          </span>
        </BaseTooltip>
      </div>

      {isClient && (
        <BaseMaterialReactTable<AdminMessage>
          columns={columns}
          data={data}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => {
            const message = row.original;
            return (
              <BaseBox className="flex items-center gap-1">
                <BaseTooltip title="Delete message">
                  <BaseIconButton
                    size="small"
                    color="error"
                    onClick={() => handleRequestDelete(message)}
                  >
                    <DeleteIcon fontSize="small" />
                  </BaseIconButton>
                </BaseTooltip>
              </BaseBox>
            );
          }}
          enableGrouping
          // Group by conversation by default
          initialState={{
            pagination: {
              pageIndex: 0,
              pageSize: 25,
            },
            sorting: [
              {
                id: "createdAt",
                desc: true,
              },
            ],
            grouping: ["conversation"],
          }}
          state={{
            isLoading,
            showProgressBars: isRefetching,
          }}
        />
      )}
    </div>
  );
}
