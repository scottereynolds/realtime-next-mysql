// src/hooks/useSocket.ts
"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useLoading } from "@/contexts/LoadingContext";

let socketInstance: Socket | null = null;

/**
 * useSocket
 *
 * Returns a singleton Socket.IO client instance and wires it into
 * the global LoadingContext using the "socket" channel.
 *
 * This hook is deliberately "dumb": it does NOT mutate any React Query
 * cache or handle feature-specific events. Individual features
 * (ChatLauncher, ChatWindow, etc.) attach their own listeners.
 */
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Reuse the existing singleton if it already exists
    if (socketInstance) {
      setSocket(socketInstance);
      return;
    }

    const url =
      process.env.NEXT_PUBLIC_WS_SERVER_URL ?? "http://localhost:4000";

    startLoading("socket");

    const s: Socket = io(url, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketInstance = s;
    setSocket(s);

    const handleConnect = () => {
      // eslint-disable-next-line no-console
      console.log("[useSocket] Connected to", url, "as", s.id);
      stopLoading("socket");
    };

    const handleConnectError = (err: Error) => {
      // eslint-disable-next-line no-console
      console.error("[useSocket] connect_error", err);
      stopLoading("socket");
    };

    const handleDisconnect = (reason: string) => {
      // eslint-disable-next-line no-console
      console.log("[useSocket] Disconnected:", reason);
    };

    s.on("connect", handleConnect);
    s.on("connect_error", handleConnectError);
    s.on("disconnect", handleDisconnect);

    // We keep the singleton alive for the whole app; no disconnect here.
    // On unmount, just detach this hook's listeners.
    return () => {
      s.off("connect", handleConnect);
      s.off("connect_error", handleConnectError);
      s.off("disconnect", handleDisconnect);
    };
  }, [startLoading, stopLoading]);

  return socket;
}
