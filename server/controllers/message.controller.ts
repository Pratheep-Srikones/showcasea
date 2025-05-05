import { TRPCError } from "@trpc/server";
import { Message } from "@/db/models/message.model";
import mongoose from "mongoose";
import { Chat } from "@/db/models/chat.model";

export const getMessages = async (chatId: string) => {
  try {
    const messages = await Message.find({ chatId })
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .sort({ createdAt: -1 });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get messages",
    });
  }
};

export const addMessage = async (
  chatId: string,
  senderId: string,
  content: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const chat = await Chat.findById(chatId).session(session);
    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    const message = await Message.create(
      [
        {
          chat: chatId,
          sender: senderId,
          content,
        },
      ],
      { session }
    );

    const newMessage = await Message.findById(message[0]._id)
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("chat", {
        participants: 1,
      });

    const senderKey = `unreadCounts.${senderId}`;
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: newMessage._id,
        },
        $setOnInsert: {
          [senderKey]: 0,
        },
      },
      { session }
    );

    for (const receiverId of chat.participants) {
      if (receiverId.toString() !== senderId.toString()) {
        const receiverKey = `unreadCounts.${receiverId}`;
        if (!chat.unreadCounts?.has(receiverId.toString())) {
          await Chat.findByIdAndUpdate(
            chatId,
            { $set: { [receiverKey]: 0 } },
            { session }
          );
        }

        await Chat.findByIdAndUpdate(
          chatId,
          { $inc: { [receiverKey]: 1 } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    return newMessage;
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add message",
    });
  } finally {
    session.endSession();
  }
};
