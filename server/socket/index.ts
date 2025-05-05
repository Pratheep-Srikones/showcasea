// server/socket.ts
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createClient } from "redis";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // Adjust for your frontend
});

const redisSub = createClient({
  url: process.env.REDIS_URL,
});

redisSub.connect().then(() => {
  console.log("Server connected to Redis");
});

let userSockets: { [key: string]: string } = {}; // Store user sockets
export const getUserSocketId = (userId: string) => {
  return userSockets[userId];
};

redisSub.subscribe("newNotification", (payload) => {
  const data = JSON.parse(payload);
  const { userId, notification } = data;
  const userSocket = userSockets[userId as string];
  console.log("Redis data received:", data);
  io.to(userSocket).emit("newNotification", notification); // Send notification to user
  console.log("Notification sent to user:", userId);
  console.log("User socket ID:", userSocket);
});

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  //console.log("Query:", socket.handshake.query.userId);
  const userId = socket.handshake.query.userId as string;
  if (!userId) {
    console.error("User ID not provided in socket connection.");
    return;
  }
  // Update the socket ID for the user, ensuring no duplicates
  userSockets[userId] = socket.id;
  //console.log(userSockets);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Send a new notification every 3 seconds

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});

export default io;
