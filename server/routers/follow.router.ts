import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import {
  addFollow,
  removeFollow,
  getFollowers,
  getFollowing,
  isFollowing,
  getSuggestedUsers,
} from "../controllers/follow.controller";

export const followRouter = router({
  followUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await addFollow(ctx.user._id, input.followingId);
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await removeFollow(ctx.user._id, input.followingId);
    }),

  getFollowers: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await getFollowers(input);
  }),

  getFollowing: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await getFollowing(input);
  }),

  isFollowing: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await isFollowing(ctx.user._id, input.followingId);
    }),

  getSuggestions: protectedProcedure.query(async ({ ctx }) => {
    return await getSuggestedUsers(ctx.user._id);
  }),
});
