import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.NEXT_SERVER_URL },
});

// Redis clients for adapter
const redisPub = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 17707,
  },
});
const redisSub = redisPub.duplicate(); // Needed for adapter
await redisPub.connect();
await redisSub.connect();

io.adapter(createAdapter(redisPub, redisSub));
console.log("Socket.IO server connected to Redis");

// External Redis client for events published by your backend
const redisEventsClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 17707,
  },
});
await redisEventsClient.connect();

// Listen for newNotification events
redisEventsClient.subscribe("newNotification", (payload) => {
  try {
    const { userId, notification } = JSON.parse(payload);
    io.to(userId).emit("newNotification", notification);
  } catch (err) {
    console.error("Invalid newNotification payload", err);
  }
});

// Listen for newMessage events
redisEventsClient.subscribe("newMessage", (payload) => {
  try {
    const { newMessage, receiverId } = JSON.parse(payload);
    io.to(receiverId).emit("newMessage", { newMessage, receiverId });
    console.log("Message sent to user:", receiverId);
  } catch (err) {
    console.error("Invalid newMessage payload", err);
  }
});

// Socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (!userId) {
    console.error("User ID missing from connection");
    socket.disconnect();
    return;
  }

  // Join a room named after the user ID
  socket.join(userId);
  console.log(`User ${userId} joined room ${userId}`);

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    // No need to manually clean up — Socket.IO handles room cleanup
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});

export default io;
