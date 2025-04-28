import {
  uploadArworkImagesGetUrls,
  uploadPostImage,
  uploadProfileImage,
} from "@/lib/cloud/cloudinary";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";

export const imageRouter = router({
  uploadProfileImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const upload_url = await uploadProfileImage(input, ctx.user._id);
      console.log(upload_url);
      return upload_url;
    }),
  uploadPostImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const uploadRes = await uploadPostImage(input);
      console.log(uploadRes);
      return uploadRes.secure_url;
    }),

  uploadArtWorkImages: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const uploadRes = await uploadArworkImagesGetUrls(input);
      console.log(uploadRes);
      return uploadRes;
    }),
});
