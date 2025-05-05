import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NotificationType } from "@/types/types";
import { Socket } from "socket.io-client";

interface NotificationState {
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  subscribeToNotifications: (
    socket: Socket,
    userId: string,
    onNewNotification: (notification: NotificationType) => void
  ) => void;
  unsubscribeFromNotifications: (socket: Socket) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      setNotifications: (notifications: NotificationType[]) =>
        set({ notifications }),
      subscribeToNotifications: (
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
      },
      unsubscribeFromNotifications: (socket: Socket) => {
        if (socket) {
          socket.off("newNotification");
        } else {
          console.error(
            "Socket not connected. Cannot unsubscribe from messages."
          );
        }
      },
    }),
    {
      name: "notification-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
