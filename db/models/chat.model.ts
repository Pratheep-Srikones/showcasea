import mongoose, { Schema, model, models } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
