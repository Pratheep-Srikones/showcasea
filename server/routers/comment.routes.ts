import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";

import { z } from "zod";

import {
  AddComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller";

export const commentRouter = router({
  addComment: protectedProcedure
    .input(
      z.object({
        artWork_id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await AddComment(ctx.user._id, input.artWork_id, input.content);
    }),

  getComments: publicProcedure
    .input(z.object({ artWork_id: z.string() }))
    .query(async ({ input }) => {
      return await getComments(input.artWork_id);
    }),

  deleteComment: protectedProcedure
    .input(z.object({ comment_id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteComment(input.comment_id);
    }),
});
