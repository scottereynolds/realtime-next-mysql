import type { Server as IOServer } from "socket.io";

// Persist the io instance across HMR in dev
const globalForSocket = globalThis as unknown as {
  io?: IOServer;
};

export function setIO(io: IOServer) {
  globalForSocket.io = io;
}

export function getIO(): IOServer {
  const io = globalForSocket.io;
  if (!io) {
    throw new Error("Socket.IO server has not been initialized.");
  }
  return io;
}
