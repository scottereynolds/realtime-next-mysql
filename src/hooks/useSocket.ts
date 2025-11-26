"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io("http://localhost:4000");
    }
    setSocket(socketInstance);

    return () => {
      // we keep the singleton alive for the whole app; no disconnect here
    };
  }, []);

  return socket;
}
