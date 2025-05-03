import mongoose, { Schema, model, models } from "mongoose";

export const FollowSchema = new Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Follow = models.Follow || model("Follow", FollowSchema);
