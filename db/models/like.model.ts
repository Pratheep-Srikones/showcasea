import mongoose, { Schema, model, models } from "mongoose";

const likeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
  },
  { timestamps: false } // No need for timestamps in likes
);

export const Like = models.Like || model("Like", likeSchema);
