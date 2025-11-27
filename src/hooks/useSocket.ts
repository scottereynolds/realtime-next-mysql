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
 */
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (!socketInstance) {
      // First time we create the socket, mark socket-level loading as active.
      startLoading("socket");

      socketInstance = io("http://localhost:4000", {
        autoConnect: true,
      });

      // Connected successfully
      socketInstance.on("connect", () => {
        stopLoading("socket");
      });

      // Connection error – stop loading so the bar doesn't hang forever
      socketInstance.on("connect_error", () => {
        stopLoading("socket");
      });

      // Reconnect attempts – show loading again
      socketInstance.on("reconnect_attempt", () => {
        startLoading("socket");
      });

      // Reconnected – stop loading
      socketInstance.on("reconnect", () => {
        stopLoading("socket");
      });

      // Disconnected – if not an intentional client disconnect, show loading
      socketInstance.on("disconnect", (reason: string) => {
        if (reason !== "io client disconnect") {
          startLoading("socket");
        }
      });
    }

    // All hook instances share the same socket instance
    setSocket(socketInstance);

    return () => {
      // We keep the singleton alive for the whole app; no disconnect here.
      // Listeners also stay attached since they operate on the global instance.
    };
  }, [startLoading, stopLoading]);

  return socket;
}
