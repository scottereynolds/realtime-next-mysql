"use client";

import { useEffect, useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import ChatWindow from "@/features/messages/components/ChatWindow";
import { useSocket } from "@/hooks/useSocket";
import BaseIconButton from "@/components/MUI/Inputs/BaseIconButton";
import { BaseBadge } from "@/components/MUI/DataDisplay/BaseBadge";
import { BaseTooltip } from "@/components/MUI/DataDisplay/BaseTooltip";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const socket = useSocket();

  // Initial unread count
  useEffect(() => {
    let isMounted = true;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        setTotalUnread(data.totalUnread ?? 0);
      } catch {
        // ignore for now
      }
    };

    void fetchUnread();

    return () => {
      isMounted = false;
    };
  }, []);

  // Live updates from WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleUnreadSummary = (payload: {
      totalUnread: number;
      conversations: { conversationId: number; unreadCount: number }[];
    }) => {
      setTotalUnread(payload.totalUnread ?? 0);
    };

    const handleNewMessage = () => {
      // Optimistic bump; will be corrected by unreadSummary
      setTotalUnread((prev) => prev + 1);
    };

    socket.on("messages:unreadSummary", handleUnreadSummary);
    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("messages:unreadSummary", handleUnreadSummary);
      socket.off("message:new", handleNewMessage);
    };
  }, [socket]);

  return (
    <>
      <BaseTooltip title="Messages">
        <BaseIconButton
          aria-label="Open messages"
          onClick={() => setOpen((prev) => !prev)}
          size="large"
        >
          <BaseBadge
            color="error"
            overlap="circular"
            badgeContent={totalUnread > 99 ? "99+" : totalUnread || null}
          >
            <ChatBubbleOutlineIcon fontSize="medium" />
          </BaseBadge>
        </BaseIconButton>
      </BaseTooltip>

      <ChatWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
