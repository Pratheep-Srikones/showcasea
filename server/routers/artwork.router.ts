import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import { createArtwork } from "../controllers/artwork.controller";
export const artWorkRouter = router({
  createArtWork: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        image_urls: z.array(z.string()),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return createArtwork({
        ...input,
        artistId: ctx.user._id,
      });
    }),
});
