import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // For efficient lookup by user
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "system"],
      required: true,
      index: true, // Useful for filtering/sorting
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtWork",
    },
    comment: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true, // For quickly fetching unread notifications
    },
    readAt: {
      type: Date,
      default: null,
      index: {
        expireAfterSeconds: 86400, // TTL: 1 day after being read
      },
    },
  },
  { timestamps: true }
);

// Additional compound index for sorting user notifications efficiently
NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification =
  models.Notification || model("Notification", NotificationSchema);
