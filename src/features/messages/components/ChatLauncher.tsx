// src/features/messages/components/ChatLauncher.tsx
"use client";

import { useEffect, useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import ChatWindow from "@/features/messages/components/ChatWindow";
import { useSocket } from "@/hooks/useSocket";
import BaseIconButton from "@/components/MUI/Inputs/BaseIconButton";
import { BaseBadge } from "@/components/MUI/DataDisplay/BaseBadge";
import { BaseTooltip } from "@/components/MUI/DataDisplay/BaseTooltip";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { SOCKET_EVENTS } from "@/types/socket";

type UnreadSummaryResponse = {
  totalUnread: number;
  conversations: {
    conversationId: number;
    unreadCount: number;
  }[];
  userId?: string; // present on socket payload, not on HTTP response
};

function debugLog(label: string, payload: any) {
  // eslint-disable-next-line no-console
  console.log(`[ChatLauncher] ${label}`, payload);
}

async function fetchUnreadSummary(): Promise<UnreadSummaryResponse> {
  const res = await fetch("/api/messages/unread", { cache: "no-store" });
  if (!res.ok) {
    debugLog("fetchUnreadSummary ERROR", {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error("Failed to load unread messages summary");
  }
  const json = (await res.json()) as UnreadSummaryResponse;
  debugLog("fetchUnreadSummary RESULT", json);
  return json;
}

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [hasNewWhileClosed, setHasNewWhileClosed] = useState(false);

  const socket = useSocket();
  const { showSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string | undefined;
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["messages", "unread"],
    queryFn: fetchUnreadSummary,
    staleTime: 30_000,
    enabled: !!currentUserId,
  });

  // 🔒 IMPORTANT: ignore unread data that is for a different user
  const rawTotalUnread = data?.totalUnread ?? 0;
  const isForeignUserData =
    !!data?.userId &&
    !!currentUserId &&
    data.userId !== currentUserId;

  const badgeTotalUnread = isForeignUserData ? 0 : rawTotalUnread;

  useEffect(() => {
    debugLog("STATE CHANGE", {
      currentUserId,
      queryStatus: status,
      data,
      isForeignUserData,
      badgeTotalUnread,
    });
  }, [currentUserId, status, data, isForeignUserData, badgeTotalUnread]);

  // Clear pulse when everything is read (for *this* user)
  useEffect(() => {
    if (badgeTotalUnread === 0) {
      setHasNewWhileClosed(false);
    }
  }, [badgeTotalUnread]);

  useEffect(() => {
    if (!socket || !currentUserId) {
      debugLog("Socket/useSession not ready", {
        hasSocket: !!socket,
        currentUserId,
      });
      return;
    }

    const handleUnreadSummary = (payload: UnreadSummaryResponse) => {
      debugLog("SOCKET messages:unreadSummary RECEIVED", payload);

      if (payload.userId && payload.userId !== currentUserId) {
        debugLog("SOCKET unreadSummary IGNORED (different userId)", {
          payloadUserId: payload.userId,
          currentUserId,
        });
        return;
      }

      debugLog("SOCKET unreadSummary → invalidate queries", {
        queryKey: ["messages", "unread"],
      });

      queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
    };

    const handleMessageNew = (payload: any) => {
      debugLog("SOCKET message:new RECEIVED raw", payload);

      const message = payload?.message;
      const senderId = message?.senderId as string | undefined;

      // Ignore our own outbound messages
      if (!message || !senderId || senderId === currentUserId) {
        debugLog("SOCKET message:new IGNORED (own message or invalid)", {
          senderId,
          currentUserId,
          hasMessage: !!message,
        });
        return;
      }

      // Only care when the window is closed
      if (open) {
        debugLog("SOCKET message:new IGNORED (window open)", { open });
        return;
      }

      setHasNewWhileClosed(true);

      const senderName =
        message?.sender?.name ||
        message?.sender?.email ||
        "New message";
      const snippet =
        typeof message?.content === "string"
          ? message.content.slice(0, 80)
          : "";

      debugLog("SOCKET message:new → showSnackbar", {
        senderName,
        snippet,
      });

      showSnackbar({
        message: `${senderName}: ${snippet}`,
        variant: "info",
        autoHideDuration: 5000,
      });
    };

    debugLog("Socket listeners ATTACH", { currentUserId });

    socket.on(SOCKET_EVENTS.MESSAGES_UNREAD_SUMMARY, handleUnreadSummary);
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleMessageNew);

    return () => {
      debugLog("Socket listeners DETACH", { currentUserId });
      socket.off(
        SOCKET_EVENTS.MESSAGES_UNREAD_SUMMARY,
        handleUnreadSummary,
      );
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleMessageNew);
    };
  }, [socket, open, showSnackbar, currentUserId, queryClient]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);

    debugLog("handleToggle", { next });

    if (next) {
      setHasNewWhileClosed(false);
    }
  };

  const badgeContent =
    badgeTotalUnread > 99 ? "99+" : badgeTotalUnread > 0 ? badgeTotalUnread : null;

  const tooltipTitle =
    badgeTotalUnread > 0
      ? `Messages (unread: ${badgeTotalUnread})`
      : "Messages (unread: 0)";

  return (
    <>
      <BaseTooltip title={tooltipTitle}>
        <BaseIconButton
          aria-label="Open chat"
          size="large"
          onClick={handleToggle}
          className={hasNewWhileClosed ? "animate-pulse" : undefined}
          data-testid="chat-launcher-button"
        >
          <BaseBadge
            color="error"
            overlap="circular"
            badgeContent={badgeContent}
            data-testid="chat-launcher-badge"
          >
            <ChatBubbleOutlineIcon fontSize="medium" />
          </BaseBadge>
        </BaseIconButton>
      </BaseTooltip>

      <ChatWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
