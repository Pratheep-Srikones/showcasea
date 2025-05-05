import { TRPCError } from "@trpc/server";
import { Notification } from "@/db/models/notfication.model";
import { redisPub, connectRedis } from "@/lib/utils/redis";

export const addNotification = async (
  sender: string,
  recipient: string,
  type: string,
  artwork?: string | null,
  comment?: string | null
) => {
  try {
    const newNotification = await Notification.create({
      sender,
      recipient,
      type,
      artwork,
      comment,
    });

    const populatedNotification = await Notification.findById(
      newNotification._id
    )
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("artwork", {
        title: 1,
        image_url: 1,
      });

    if (!redisPub.isReady) {
      await connectRedis();
    }

    if (redisPub.isReady) {
      console.log("Redis is ready, publishing notification...");
      await redisPub.publish(
        "newNotification",
        JSON.stringify({
          userId: recipient,
          notification: populatedNotification,
        })
      );
    }
    return populatedNotification;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add notification",
    });
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("artwork", {
        title: 1,
        image_url: 1,
      })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to the latest 20 notifications
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch notifications",
    });
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date(); // Set TTL timestamp
    await notification.save();

    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark notification as read",
    });
  }
};

export const getUnreadCount = async (userId: string) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
    return count;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch unread notification count",
    });
  }
};
