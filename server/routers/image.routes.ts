import { uploadPostImage, uploadProfileImage } from "@/lib/cloud/cloudinary";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";

export const imageRouter = router({
  uploadProfileImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const uploadRes = await uploadProfileImage(input);
      console.log(uploadRes);
      return uploadRes.secure_url;
    }),
  uploadPostImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const uploadRes = await uploadPostImage(input);
      console.log(uploadRes);
      return uploadRes.secure_url;
    }),
});
