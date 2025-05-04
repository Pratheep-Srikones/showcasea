"use client";

import { trpc } from "@/lib/trpc/client";
import { useArtStore } from "@/store/useArtStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import socket from "@/lib/helpers/socket";

export default function NotificationsPage() {
  // In NotificationsPage.tsx

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const { setSelectedArtWork } = useArtStore();
  const router = useRouter();
  const { data: notificationsData, isPending } =
    trpc.notification.getNotifications.useQuery();

  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const markAsRead = trpc.notification.markAsRead.useMutation();
  const fetchArtwork = trpc.artWork.getArtWorkById.useMutation();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6 text-primary">Notifications</h1>

      {isPending && (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      )}

      {!isPending && (!notifications || notifications.length === 0) && (
        <p className="text-muted-foreground">No notifications to show.</p>
      )}

      {!isPending &&
        notifications &&
        notifications.map((n) => (
          <div
            key={n._id}
            className={`relative p-4 rounded-md border shadow-sm transition-all ${
              !n.isRead ? "bg-muted" : "bg-background"
            }`}
            onClick={() => {
              if (!n.isRead) {
                markAsRead.mutate(
                  { notificationId: n._id },
                  {
                    onSuccess: () => {
                      setNotifications((prev) =>
                        prev.map((notification) =>
                          notification._id === n._id
                            ? { ...notification, isRead: true }
                            : notification
                        )
                      );
                    },
                  }
                );
              }
            }}
          >
            {!n.isRead && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full" />
            )}

            <div className="flex items-start gap-3">
              {n.sender?.profilePic && (
                <Image
                  src={n.sender.profilePic}
                  alt={n.sender.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm leading-5 ${
                    !n.isRead ? "font-semibold" : ""
                  }`}
                >
                  {n.sender ? (
                    <Link
                      href={`/profile/${n.sender._id}`}
                      className="font-medium hover:underline"
                    >
                      {n.sender.username}
                    </Link>
                  ) : (
                    <span className="font-medium text-primary">System</span>
                  )}{" "}
                  {n.type === "like" && "liked your artwork"}
                  {n.type === "comment" && "commented on your artwork"}
                  {n.type === "follow" && "started following you"}
                  {n.type === "system" && "sent you a system notification"}
                </p>

                {n.comment && (
                  <p className="text-xs text-muted-foreground mt-1">
                    “{n.comment}”
                  </p>
                )}

                {n.artwork && (
                  <div
                    onClick={() => {
                      fetchArtwork.mutate(n.artwork._id, {
                        onSuccess: (artwork) => {
                          setSelectedArtWork(artwork);
                          router.push(`/artwork`);
                        },
                      });
                    }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    View artwork: {n.artwork.title}
                  </div>
                )}

                {isClient && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
