import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";

import { z } from "zod";
import {
  addMessage,
  getMessages,
  getTotalUnreadCount,
} from "../controllers/message.controller";

export const messageRouter = router({
  getMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getMessages(input.chatId);
    }),

  addMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await addMessage(input.chatId, ctx.user._id, input.content);
    }),

  getTotalUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getTotalUnreadCount(ctx.user._id);
  }),
});
