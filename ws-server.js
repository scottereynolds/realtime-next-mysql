// ws-server.js
const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("message:created", (payload) => {
    // Broadcast to all other clients
    socket.broadcast.emit("message:created", payload);
  });

  socket.on("message:deleted", (payload) => {
    socket.broadcast.emit("message:deleted", payload);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("WebSocket server listening on http://localhost:4000");