import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../controllers/notification.controller";

export const notificationRouter = router({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await getNotifications(ctx.user._id);
  }),
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadCount(ctx.user._id);
  }),
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await markAsRead(input.notificationId);
    }),
});
