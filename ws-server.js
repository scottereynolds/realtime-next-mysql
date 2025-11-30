// ws-server.js
const { Server } = require("socket.io");

const PORT = Number(process.env.WS_PORT || 4000);
const ORIGIN = process.env.WS_ORIGIN || "http://localhost:3000";

const io = new Server(PORT, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("[ws-server] Client connected:", socket.id);

  // Generic relay: broadcast ANY event to all other clients
  socket.onAny((event, payload) => {
    // Helpful while we’re wiring things up
    console.log(`[ws-server] Relaying event "${event}" from ${socket.id}`);
    socket.broadcast.emit(event, payload);
  });

  socket.on("disconnect", (reason) => {
    console.log("[ws-server] Client disconnected:", socket.id, "reason:", reason);
  });
});

console.log(`[ws-server] Listening on http://localhost:${PORT}`);
console.log(`[ws-server] CORS origin: ${ORIGIN}`);
