import { TRPCError } from "@trpc/server";
import { Message } from "@/db/models/message.model";
import mongoose from "mongoose";
import { Chat } from "@/db/models/chat.model";
import { redisPub, connectRedis } from "@/lib/utils/redis";

export const getMessages = async (chatId: string) => {
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .sort({ createdAt: 1 });

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

    // Create message
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

    const newMessageId = message?.[0]?._id;
    if (!newMessageId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Message creation failed",
      });
    }

    // Update lastMessage and sender's unread count (set to 0 if needed)
    const senderKey = `unreadCounts.${senderId}`;
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: newMessageId,
        },
        $setOnInsert: {
          [senderKey]: 0,
        },
      },
      { session }
    );
    let reciver;
    // Update unreadCounts for other participants
    for (const receiverId of chat.participants) {
      if (receiverId.toString() !== senderId.toString()) {
        reciver = receiverId.toString(); //since there are only two participants, we can use the other one as receiverId
        const receiverKey = `unreadCounts.${receiverId}`;

        if (!chat.unreadCounts?.[receiverId.toString()]) {
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
    session.endSession();

    // Populate outside the transaction
    const populatedMessage = await Message.findById(newMessageId)
      .populate("sender", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("chat", {
        participants: 1,
      });
    if (!redisPub.isReady) {
      await connectRedis();
    }
    if (redisPub.isReady) {
      console.log("Redis is ready, publishing message...");
      await redisPub.publish(
        "newMessage",
        JSON.stringify({
          newMessage: populatedMessage,
          receiverId: reciver,
        })
      );
    }
    return populatedMessage;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add message",
    });
  }
};

export const getTotalUnreadCount = async (userId: string) => {
  try {
    const chats = await Chat.find({ participants: userId });
    const totalUnreadCount = chats.reduce((acc, chat) => {
      const unreadCount = chat.unreadCounts?.[userId] || 0;
      return acc + unreadCount;
    }, 0);
    return totalUnreadCount;
  } catch (error) {
    console.error("Error fetching total unread count:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get total unread count",
    });
  }
};
