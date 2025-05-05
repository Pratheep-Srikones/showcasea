import { Socket } from "socket.io-client";
import { NotificationType } from "@/types/types";

// Function to subscribe to notifications
export const subscribeToNotifications = (
  socket: Socket,
  userId: string,
  onNewNotification: (notification: NotificationType) => void
) => {
  if (!socket) {
    console.error("Socket instance is undefined.");
    return;
  }

  const setupListener = () => {
    console.log("Subscribing to notifications.");

    socket.on("newNotification", (notification: NotificationType) => {
      console.log("New notification received:", notification);

      if (userId === notification.recipient) {
        onNewNotification(notification);
      }
    });
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

// Function to unsubscribe from notifications
export const unsubscribeFromNotifications = (socket: Socket) => {
  if (socket) {
    socket.off("newNotification");
  } else {
    console.error("Socket not connected. Cannot unsubscribe from messages.");
  }
};
