import { TRPCError } from "@trpc/server";
import { Chat } from "@/db/models/chat.model";
import { exists } from "fs";

export const getChats = async (userId: string) => {
  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("lastMessage", {
        content: 1,
        createdAt: 1,
      })
      .sort({ updatedAt: -1 });

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get chats",
    });
  }
};

export const getChat = async (chatId: string) => {
  try {
    const chat = await Chat.findById(chatId)
      .populate("participants", {
        username: 1,
        profile_picture_url: 1,
      })
      .populate("lastMessage", {
        content: 1,
        createdAt: 1,
      });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return chat;
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get chat",
    });
  }
};

export const createChat = async (participants: string[]) => {
  try {
    const chat = await Chat.create({ participants });
    const newChat = await Chat.findById(chat._id).populate("participants", {
      username: 1,
      profile_picture_url: 1,
    });
    return newChat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create chat",
    });
  }
};

export const doesChatExist = async (participants: string[]) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: participants },
      $expr: { $eq: [{ $size: "$participants" }, participants.length] },
    });

    return { exists: !!chat, chatId: chat ? chat._id : null };
  } catch (error) {
    console.error("Error checking chat existence:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check chat existence",
    });
  }
};
