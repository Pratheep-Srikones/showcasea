// utils/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Adjust for prod

export default socket;
