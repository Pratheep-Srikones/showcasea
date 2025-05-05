import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";

import { z } from "zod";
import {
  getChats,
  getChat,
  createChat,
  doesChatExist,
  markAsRead,
} from "../controllers/chat.controller";

export const chatRouter = router({
  getChats: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getChats(input.userId);
    }),

  getChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getChat(input.chatId);
    }),

  createChat: protectedProcedure
    .input(z.object({ participants: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      return await createChat(input.participants);
    }),

  doesChatExist: protectedProcedure
    .input(z.object({ participants: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      return await doesChatExist(input.participants);
    }),

  markAsRead: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await markAsRead(input, ctx.user._id);
    }),
});
