"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Avatar from "@mui/material/Avatar";
import { BaseAutocomplete } from "@/components/MUI/Inputs/BaseAutocomplete";

import { useSession } from "next-auth/react";

import {
  ConversationListItem,
  ChatMessage,
  MessagesByConversation,
  SimpleUser,
} from "@/features/messages/types/messagesTypes";

import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseTextField } from "@/components/MUI/Inputs/BaseTextField";
import BaseIconButton from "@/components/MUI/Inputs/BaseIconButton";
import { BaseTooltip } from "@/components/MUI/DataDisplay/BaseTooltip";
import { BasePaper } from "@/components/MUI/Surface/BasePaper";
import { useSocket } from "@/hooks/useSocket";

import styles from "@/features/messages/styles/message.module.css";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ViewListIcon from "@mui/icons-material/ViewList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddCommentIcon from "@mui/icons-material/AddComment";

const MIN_WIDTH = 360;
const MAX_WIDTH = 640;
const MIN_HEIGHT = 360;
const MAX_HEIGHT = 720;

const SIDEBAR_MIN_WIDTH = 140;
const SIDEBAR_DEFAULT_WIDTH = 160; // matches Tailwind w-40
const SIDEBAR_MESSAGES_MIN_SPACE = 220; // minimum space to leave for messages

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatWindow({ open, onClose }: ChatWindowProps) {
  const { data: session } = useSession();
  const socket = useSocket();

  const currentUserId = session?.user?.id as string | undefined;

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [messagesByConversation, setMessagesByConversation] =
    useState<MessagesByConversation>({});
  const [activeConversationId, setActiveConversationId] =
    useState<number | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Layout + new conversation
  const [showConversations, setShowConversations] = useState(true);
  const [isNewConversationMode, setIsNewConversationMode] = useState(false);
  const [allUsers, setAllUsers] = useState<SimpleUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [newConversationMessage, setNewConversationMessage] = useState("");

  const [dimensions, setDimensions] = useState({ width: 420, height: 560 });
  const [isResizing, setIsResizing] = useState(false);

  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 420,
    height: 560,
  });

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const sidebarResizeStartRef = useRef({
    mouseX: 0,
    width: SIDEBAR_DEFAULT_WIDTH,
  });

  const selectedUsers = useMemo(
    () => allUsers.filter((u) => selectedUserIds.includes(u.id)),
    [allUsers, selectedUserIds],
  );

  const handleParticipantsChange = (
    _event: unknown,
    value: SimpleUser[],
  ) => {
    setSelectedUserIds(value.map((u) => u.id));
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Join user-specific room once socket + user are ready
  useEffect(() => {
    if (!socket || !currentUserId) return;
    socket.emit("user:join", { userId: currentUserId });
  }, [socket, currentUserId]);

  // Load conversations (used in several places)
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch("/api/messages/conversations", {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      const convos: ConversationListItem[] = data.conversations ?? [];
      setConversations(convos);

      // If we don't have an active conversation yet (and not in new-convo mode),
      // pick the first one.
      setActiveConversationId((prev) => {
        if (prev != null || isNewConversationMode || convos.length === 0) {
          return prev;
        }
        return convos[0].id;
      });
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isNewConversationMode]);

  // Fetch conversations when the window opens
  useEffect(() => {
    if (!open) return;
    void loadConversations();
  }, [open, loadConversations]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const activeMessages: ChatMessage[] =
    (activeConversationId && messagesByConversation[activeConversationId]) || [];

  const loadMessages = useCallback(async (conversationId: number) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(
        `/api/messages/conversations/${conversationId}?take=50`,
        { cache: "no-store" },
      );
      if (!res.ok) return;

      const data = await res.json();
      const msgs: ChatMessage[] = data.messages ?? [];

      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: msgs,
      }));

      // Mark as read
      void fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: "POST",
      });

      // Locally reset unread count
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!open || !activeConversationId || isNewConversationMode) return;
    void loadMessages(activeConversationId);
  }, [open, activeConversationId, isNewConversationMode, loadMessages]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (!open || !activeConversationId || isNewConversationMode) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, open, activeConversationId, isNewConversationMode]);

  // Handle drag-resize from the bottom-left corner
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { mouseX, mouseY, width, height } = resizeStartRef.current;

      // For a bottom-left handle on a right-anchored window:
      // - Dragging LEFT should increase width
      // - Dragging DOWN should increase height
      const dx = mouseX - event.clientX; // left drag => positive
      const dy = event.clientY - mouseY; // down drag => positive

      let nextWidth = width + dx;
      let nextHeight = height + dy;

      nextWidth = Math.min(Math.max(nextWidth, MIN_WIDTH), MAX_WIDTH);
      nextHeight = Math.min(Math.max(nextHeight, MIN_HEIGHT), MAX_HEIGHT);

      setDimensions({ width: nextWidth, height: nextHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    // Prevent text selection while resizing
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    resizeStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      width: dimensions.width,
      height: dimensions.height,
    };
    setIsResizing(true);
  };

  // Handle drag-resize of the conversations sidebar (horizontal)
  useEffect(() => {
    if (!isResizingSidebar) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { mouseX, width } = sidebarResizeStartRef.current;

      const dx = event.clientX - mouseX; // drag right => positive

      // Leave at least SIDEBAR_MESSAGES_MIN_SPACE for the messages panel
      const maxWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        dimensions.width - SIDEBAR_MESSAGES_MIN_SPACE,
      );

      let nextWidth = width + dx;
      nextWidth = Math.min(Math.max(nextWidth, SIDEBAR_MIN_WIDTH), maxWidth);

      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar, dimensions.width]);

  const handleSidebarResizeMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    sidebarResizeStartRef.current = {
      mouseX: event.clientX,
      width: sidebarWidth,
    };
    setIsResizingSidebar(true);
  };

  // Live updates: new messages (from other users)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: {
      conversationId: number;
      message: ChatMessage;
    }) => {
      const { conversationId, message } = payload;

      // Ignore messages that we ourselves sent
      if (message.sender?.id === currentUserId) {
        return;
      }

      // Append message to that conversation
      setMessagesByConversation((prev) => {
        const existing = prev[conversationId] ?? [];
        return {
          ...prev,
          [conversationId]: [...existing, message],
        };
      });

      // Update conversation list (or trigger a full reload if it's a new convo)
      let hadConversation = false;

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);
        hadConversation = exists;

        if (!exists) {
          // We'll reload the whole list below
          return prev;
        }

        return prev.map((c) => {
          if (c.id !== conversationId) {
            // Other conversation: bump unread
            return {
              ...c,
              unreadCount: c.unreadCount + 1,
              latestMessage: message,
              updatedAt: message.createdAt,
            };
          }

          // Active conversation – treat as read
          return {
            ...c,
            latestMessage: message,
            updatedAt: message.createdAt,
          };
        });
      });

      if (!hadConversation) {
        void loadConversations();
      }
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, currentUserId, loadConversations]);

  const handleSelectConversation = (conversationId: number) => {
    setIsNewConversationMode(false);
    setActiveConversationId(conversationId);
    void loadMessages(conversationId);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId) return;

    setIsSending(true);
    try {
      const body = messageInput.trim();
      setMessageInput("");

      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          body,
        }),
      });

      if (!res.ok) {
        // Restore text if send fails
        setMessageInput((prev) => prev || body);
        return;
      }

      // Use the response to immediately add our own message
      const data = await res.json();
      const conversationId: number | undefined = data.conversationId;
      const message: ChatMessage | undefined = data.message;

      if (conversationId && message) {
        setMessagesByConversation((prev) => {
          const existing = prev[conversationId] ?? [];
          return {
            ...prev,
            [conversationId]: [...existing, message],
          };
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  latestMessage: message,
                  updatedAt: message.createdAt,
                }
              : c,
          ),
        );
      } else if (conversationId) {
        // Fallback if backend doesn't return the message payload
        await loadMessages(conversationId);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  // --- Conversation helpers ---

  const openNewConversation = async () => {
    setIsNewConversationMode(true);
    setActiveConversationId(null);
    setSelectedUserIds([]);
    setNewConversationMessage("");

    // Lazy-load list of users (excluding current user)
    if (allUsers.length === 0) {
      try {
        const res = await fetch("/api/users/simple", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const users: SimpleUser[] = (data.users ?? []).filter(
          (u: SimpleUser) => u.id !== currentUserId,
        );
        setAllUsers(users);
      } catch {
        // ignore for now
      }
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUserIds.length === 0 || !newConversationMessage.trim()) {
      return;
    }

    const body = newConversationMessage.trim();

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: selectedUserIds,
          body,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();
      const newConversationId: number | undefined = data.conversationId;
      const firstMessage: ChatMessage | undefined = data.message;

      if (!newConversationId) {
        return;
      }

      // Switch UI out of "new conversation" mode and into the new chat
      setIsNewConversationMode(false);
      setShowConversations(false); // collapse sidebar
      setActiveConversationId(newConversationId);

      // Clear new-convo state
      setNewConversationMessage("");
      setSelectedUserIds([]);

      // Seed messages so the new chat layout has content immediately
      if (firstMessage) {
        setMessagesByConversation((prev) => ({
          ...prev,
          [newConversationId]: [firstMessage],
        }));
      } else {
        // Fallback if backend didn't return the message payload
        await loadMessages(newConversationId);
      }

      // Refresh the conversations list so the new convo appears in the sidebar
      void loadConversations();
    } catch {
      // swallow for now or add toast later
    }
  };

  const handleNewConversationKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleCreateConversation();
    }
  };

  const headerTitle = isNewConversationMode ? "New Conversation" : "Messages";

  const headerSubtitle =
    isNewConversationMode && selectedUserIds.length > 0
      ? `${selectedUserIds.length} participant${selectedUserIds.length > 1 ? "s" : ""}`
      : activeConversation
      ? activeConversation.title ||
        activeConversation.otherParticipants
          .map((p) => p.name || "Unknown")
          .join(", ")
      : "";

  if (!open) return null;

  return (
    <BaseBox className="fixed top-16 right-4 z-2000">
      <BasePaper
        elevation={8}
        className="relative flex flex-col rounded-xl overflow-hidden"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Header with strong contrast */}
        <BaseBox className="flex items-center justify-between px-3 py-2 border-b border-slate-900 bg-slate-900 text-slate-50">
          <BaseBox className="flex items-center gap-2">
            {/* Collapse toggle */}
            <BaseTooltip
              title={
                showConversations ? "Hide conversations" : "Show conversations"
              }
            >
              <BaseIconButton
                size="small"
                onClick={() => setShowConversations((prev) => !prev)}
                sx={{ color: "inherit" }}
              >
                {showConversations ? (
                  <ChevronLeftIcon fontSize="small" />
                ) : (
                  <ViewListIcon fontSize="small" />
                )}
              </BaseIconButton>
            </BaseTooltip>

            {/* Title + subtitle */}
            <BaseBox className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">
                {headerTitle}
              </span>
              {headerSubtitle && (
                <span className="text-[11px] text-slate-300 truncate max-w-[220px]">
                  {headerSubtitle}
                </span>
              )}
            </BaseBox>
          </BaseBox>

          <BaseBox className="flex items-center gap-1">
            {/* New conversation button */}
            {!isNewConversationMode && (
              <BaseTooltip title="Start a new conversation">
                <BaseIconButton
                  size="small"
                  onClick={() => void openNewConversation()}
                  sx={{ color: "inherit" }}
                >
                  <AddCommentIcon fontSize="small" />
                </BaseIconButton>
              </BaseTooltip>
            )}

            {/* Close */}
            <BaseTooltip title="Close">
              <BaseIconButton
                size="small"
                onClick={onClose}
                sx={{ color: "inherit" }}
              >
                <CloseIcon fontSize="small" />
              </BaseIconButton>
            </BaseTooltip>
          </BaseBox>
        </BaseBox>

        {/* Body */}
        <BaseBox className="flex flex-1 overflow-hidden">
          {/* Conversations list (collapsible) */}
          {showConversations && (
            <>
              <BaseBox
                className="border-r border-slate-200 flex flex-col overflow-hidden bg-slate-50/80"
                style={{ width: sidebarWidth }}
              >
                <BaseBox className="px-2 py-1 flex items-center justify-between border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">
                    Conversations
                  </span>
                  {isLoadingConversations && (
                    <span className="text-[10px] text-slate-400">
                      Loading…
                    </span>
                  )}
                </BaseBox>

                <BaseBox className="flex-1 overflow-y-auto">
                  {/* ...unchanged conversations map + empty states... */}
                  {conversations.length === 0 &&
                    !isLoadingConversations &&
                    !isNewConversationMode && (
                      <BaseBox className="px-3 py-4 text-xs text-slate-500">
                        No conversations yet.
                      </BaseBox>
                    )}

                  {conversations.map((c) => {
                    const isActive =
                      !isNewConversationMode && c.id === activeConversationId;
                    const displayName =
                      c.title ||
                      c.otherParticipants
                        .map((p) => p.name || "Unknown")
                        .join(", ");
                    const latestSnippet = c.latestMessage?.content ?? "";

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectConversation(c.id)}
                        className={`w-full flex items-start gap-2 px-3 py-2 text-left text-xs border-b border-slate-100 hover:bg-slate-100 transition-colors ${
                          isActive ? "bg-slate-100" : ""
                        }`}
                      >
                        <Avatar
                          sx={{ width: 24, height: 24, fontSize: 12 }}
                          src={c.otherParticipants[0]?.image ?? undefined}
                        >
                          {displayName?.charAt(0).toUpperCase() ?? "C"}
                        </Avatar>
                        <BaseBox className="flex-1 overflow-hidden">
                          <BaseBox className="flex items-center justify-between gap-1">
                            <span className="font-semibold truncate text-slate-500">
                              {displayName}
                            </span>
                            {c.unreadCount > 0 && (
                              <span className="ml-1 rounded-full bg-red-500 text-white text-[10px] px-2 py-px">
                                {c.unreadCount}
                              </span>
                            )}
                          </BaseBox>
                          {latestSnippet && (
                            <span className="block text-[11px] text-slate-500 truncate mt-px">
                              {latestSnippet}
                            </span>
                          )}
                        </BaseBox>
                      </button>
                    );
                  })}
                </BaseBox>
              </BaseBox>

              {/* Vertical resize handle between sidebar and messages */}
              <BaseBox
                className="w-1 cursor-col-resize flex items-stretch bg-slate-100 hover:bg-slate-200"
                onMouseDown={handleSidebarResizeMouseDown}
              >
                <span className="mx-auto my-4 w-0.5 h-10 bg-slate-400 rounded-full" />
              </BaseBox>
            </>
          )}

          {/* Messages column / New conversation panel */}
          <BaseBox className="flex-1 flex flex-col">
            {/* Mobile-ish back bar */}
            <BaseBox className="flex items-center justify-between px-2 py-1 border-b border-slate-200 bg-white sm:hidden">
              <BaseIconButton
                size="small"
                onClick={() => {
                  setActiveConversationId(null);
                  setIsNewConversationMode(false);
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </BaseIconButton>
              <span className="text-xs font-semibold">{headerTitle}</span>
              <span className="w-6" />
            </BaseBox>

            {/* MAIN PANEL */}
            {!isNewConversationMode ? (
              <>
                {/* Messages list */}
                <BaseBox className="flex-1 overflow-y-auto px-3 py-2 bg-slate-50">
                  {isLoadingMessages && activeConversation && (
                    <BaseBox className="text-xs text-slate-400 py-2">
                      Loading messages…
                    </BaseBox>
                  )}

                  {!isLoadingMessages &&
                    activeMessages.length === 0 &&
                    activeConversation && (
                      <BaseBox className="text-xs text-slate-400 py-2">
                        No messages yet. Say hi!
                      </BaseBox>
                    )}

                  {!activeConversation && (
                    <BaseBox className="text-xs text-slate-400 py-2">
                      Select a conversation or start a new one.
                    </BaseBox>
                  )}

                  {/* Chat bubbles */}
                  {activeMessages.map((m) => {
                    const isMine = m.sender?.id === currentUserId;
                    const senderName =
                      m.sender?.name || (isMine ? "You" : "Unknown");

                    return (
                      <BaseBox
                        key={m.id}
                        className={`mb-2 flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <BaseBox className="flex max-w-[80%] gap-2 items-end">
                          {!isMine && (
                            <Avatar
                              sx={{ width: 24, height: 24, fontSize: 11 }}
                              src={m.sender?.image ?? undefined}
                            >
                              {senderName.charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                          <BaseBox
                            className={`rounded-2xl px-3 py-2 text-xs shadow-sm whitespace-pre-wrap wrap-break-word ${
                              isMine
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white text-slate-900 rounded-bl-sm"
                            }`}
                          >
                            {!isMine && (
                              <div className="text-[10px] font-semibold text-slate-500 mb-0.5">
                                {senderName}
                              </div>
                            )}
                            <div>{m.content}</div>
                          </BaseBox>
                          {isMine && (
                            <Avatar
                              sx={{ width: 24, height: 24, fontSize: 11 }}
                              src={m.sender?.image ?? undefined}
                            >
                              {(senderName || "Y").charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                        </BaseBox>
                      </BaseBox>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </BaseBox>

                {/* Current chat input row – compact & pinned to bottom */}
                <BaseBox className="border-t border-slate-200 px-2 py-2 bg-white">
                  {/* Input + send button row */}
                  <BaseBox className="flex items-center gap-2">
                    <BaseTextField
                      fullWidth
                      size="small"
                      multiline
                      minRows={1}
                      maxRows={4}
                      placeholder={
                        activeConversation
                          ? "Type a message…"
                          : "Select a conversation to start chatting…"
                      }
                      disabled={!activeConversation || isSending}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={styles.roundedFull}
                      slotProps={{
                        input: {
                          className:
                            "py-1 px-3 text-[11px] leading-snug resize-none",
                        },
                      }}
                    />
                    <BaseTooltip title="Send">
                      <span>
                        <BaseIconButton
                          size="small"
                          className="p-1 rounded-full shadow-sm"
                          sx={{
                            backgroundColor: "#2563eb", // solid blue, independent of theme
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#1d4ed8",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "rgba(148, 163, 184, 0.7)",
                              color: "#f9fafb",
                            },
                          }}
                          disabled={
                            !activeConversation ||
                            isSending ||
                            !messageInput.trim()
                          }
                          onClick={() => void handleSendMessage()}
                        >
                          <SendIcon fontSize="small" />
                        </BaseIconButton>
                      </span>
                    </BaseTooltip>
                  </BaseBox>

                  {/* Subtle global sending indicator */}
                  {isSending && (
                    <BaseBox className="flex justify-end mt-1 pr-1">
                      <span className="text-[10px] italic text-slate-400">
                        Sending…
                      </span>
                    </BaseBox>
                  )}
                </BaseBox>
              </>
            ) : (
              // CONVERSATION PANEL
              <BaseBox className="flex-1 flex	flex-col bg-slate-50">
                <BaseBox className="flex-1 overflow-y-auto px-3 py-2">
                  <BaseBox className="mb-3">
                    <div className="text-xs font-semibold text-slate-700 mb-1">
                      Choose participants
                    </div>
                    <div className="text-[11px] text-slate-500 mb-2">
                      Type to search and select one or more users.
                    </div>
                  </BaseBox>

                  {allUsers.length === 0 ? (
                    <BaseBox className="text-xs text-slate-400 py-2">
                      No other users found.
                    </BaseBox>
                  ) : (
                    <BaseAutocomplete<SimpleUser, true, false, false>
                      multiple
                      options={allUsers}
                      value={selectedUsers}
                      className={styles.roundedFull}
                      onChange={handleParticipantsChange}
                      disableCloseOnSelect
                      filterSelectedOptions
                      getOptionLabel={(user) =>
                        user.name || user.email || user.id.substring(0, 8)
                      }
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => {
                        const label =
                          option.name || option.email || option.id.substring(0, 8);

                        return (
                          <li {...props} key={option.id}>
                            <BaseBox className="flex items-center gap-2">
                              <Avatar
                                sx={{ width: 24, height: 24, fontSize: 12 }}
                                src={option.image ?? undefined}
                              >
                                {label.charAt(0).toUpperCase()}
                              </Avatar>
                              <BaseBox className="flex flex-col">
                                <span className="text-xs text-slate-800">{label}</span>
                                {option.email && (
                                  <span className="text-[10px] text-slate-500">
                                    {option.email}
                                  </span>
                                )}
                              </BaseBox>
                            </BaseBox>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <BaseTextField
                          {...params}
                          size="small"
                          placeholder="Search participants…"
                        />
                      )}
                    />
                  )}
                </BaseBox>

                {/* First message + icon submit at bottom */}
                <BaseBox className="border-t border-slate-200 px-2 py-2 flex items-center gap-2 bg-white">
                  <BaseTextField
                    fullWidth
                    size="small"
                    placeholder="First message…"
                    value={newConversationMessage}
                    onChange={(e) => setNewConversationMessage(e.target.value)}
                    onKeyDown={handleNewConversationKeyDown}
                    className={styles.roundedFull}
                    slotProps={{
                      input: {
                        className: "py-0.5 px-3 text-[11px]",
                      },
                    }}
                  />
                  <BaseTooltip title="Start chat">
                    <span>
                      <BaseIconButton
                        size="small"
                        className="p-1 rounded-full shadow-sm"
                        sx={{
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#1d4ed8",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(148, 163, 184, 0.7)",
                            color: "#f9fafb",
                          },
                        }}
                        disabled={
                          selectedUserIds.length === 0 ||
                          !newConversationMessage.trim()
                        }
                        onClick={() => void handleCreateConversation()}
                      >
                        <SendIcon fontSize="small" />
                      </BaseIconButton>
                    </span>
                  </BaseTooltip>
                </BaseBox>
              </BaseBox>
            )}
          </BaseBox>
        </BaseBox>

        {/* Resize handle – bottom-left corner */}
        <BaseBox
          className="absolute bottom-1 left-1 w-3 h-3 cursor-nesw-resize flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-500"
          onMouseDown={handleResizeMouseDown}
        >
          {/* little L-shaped graphic */}
          <span className="block w-2 h-2 border-l border-b border-slate-300" />
        </BaseBox>
      </BasePaper>
    </BaseBox>
  );
}
