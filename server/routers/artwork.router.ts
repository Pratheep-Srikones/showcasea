import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import {
  createArtwork,
  deleteArtwork,
  editArtwork,
  getArtWorkById,
  getArtWorksByArtistId,
  getArtWorksbyTag,
  getArtworksByTitle,
  getArtWorkSortedBy,
  getFilteredArtWorkCount,
  getFilteredArtworks,
  getSuggestedArtworks,
  increaseViewCount,
} from "../controllers/artwork.controller";
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

  getArtWorksByArtistId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await getArtWorksByArtistId(input);
    }),

  increaseViewCount: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await increaseViewCount(input);
    }),

  editArtwork: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return editArtwork(input, ctx.user._id);
    }),

  deleteArtwork: protectedProcedure
    .input(z.object({ artworkId: z.string(), image_urls: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      return await deleteArtwork(
        input.artworkId,
        input.image_urls,
        ctx.user._id
      );
    }),
  getArtWorksByTag: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getArtWorksbyTag(input);
    }),

  getArtWorkSortedBy: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getArtWorkSortedBy(input);
    }),

  getFilteredArtWorkCount: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getFilteredArtWorkCount(input);
    }),

  getFilteredArtworks: publicProcedure
    .input(
      z.object({
        tag: z.string(),
        sortBy: z.string(),
        start: z.number(),
        offset: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await getFilteredArtworks(
        input.tag,
        input.sortBy,
        input.start,
        input.offset
      );
    }),

  getSuggestedArtworks: protectedProcedure
    .input(z.object({ start: z.number(), offset: z.number() }))
    .query(async ({ input, ctx }) => {
      return await getSuggestedArtworks(
        ctx.user._id,
        input.start,
        input.offset
      );
    }),

  getArtWorkById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await getArtWorkById(input);
    }),

  getArtworksByTitle: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getArtworksByTitle(input);
    }),
});
