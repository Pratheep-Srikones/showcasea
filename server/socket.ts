// server/socket.ts
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // Adjust for your frontend
});

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);

  socket.on("markRead", (notificationId) => {
    // update DB and maybe emit back to clients
    socket.broadcast.emit("notificationRead", notificationId);
  });

  socket.on("newNotification", (notification) => {
    // Emit the new notification to all connected clients
    io.emit("newNotification", "Hello Socket");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Send a new notification every 3 seconds

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
