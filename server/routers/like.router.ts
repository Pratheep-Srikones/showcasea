import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";

import { z } from "zod";

import {
  hasLiked,
  likeArtWork,
  unlikeArtWork,
} from "../controllers/like.controller";

export const likeRouter = router({
  likeArtWork: protectedProcedure
    .input(
      z.object({
        artWork_id: z.string(),
        artist_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await likeArtWork(ctx.user._id, input.artWork_id, input.artist_id);
    }),

  unlikeArtWork: protectedProcedure
    .input(
      z.object({
        artWork_id: z.string(),
        artist_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await unlikeArtWork(
        ctx.user._id,
        input.artWork_id,
        input.artist_id
      );
    }),
  hasLiked: protectedProcedure
    .input(z.object({ liker_id: z.string(), artWork_id: z.string() }))
    .query(async ({ input, ctx }) => {
      return hasLiked(input.liker_id, input.artWork_id);
    }),
});
