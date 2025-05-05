import { Socket } from "socket.io-client";
import { MessageType } from "@/types/types";

export const subscribeToMessages = (
  socket: Socket,
  userId: string,
  onNewMessage: (message: MessageType) => void
) => {
  if (!socket) {
    console.error("Socket instance is undefined.");
    return;
  }

  const setupListener = () => {
    console.log("Subscribing to messages.");

    socket.on(
      "newMessage",
      (payload: { newMessage: MessageType; receiverId: string }) => {
        console.log("New message received:", payload);

        if (userId === payload.receiverId) {
          onNewMessage(payload.newMessage);
        }
      }
    );
  };

  if (socket.connected) {
    setupListener();
  } else {
    socket.once("connect", () => {
      console.log("Socket connected (delayed). Now subscribing...");
      setupListener();
    });
  }
};

export const unsubscribeFromMessages = (socket: Socket) => {
  if (socket) {
    socket.off("newMessage", () => {});
  } else {
    console.error("Socket not connected. Cannot unsubscribe from messages.");
  }
};
