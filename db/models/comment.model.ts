import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artWorkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtWork",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = models.Comment || model("Comment", CommentSchema);
