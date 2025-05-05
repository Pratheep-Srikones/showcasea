import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import {
  getTotalCountsForUser,
  getUserById,
  getUsernameById,
  loginUser,
  logoutUser,
  signupUser,
  updateNotifications,
  updatePassword,
  updatePrivacy,
  updateUserDetails,
  updateUserPicture,
  updateUserSocialMedia,
} from "../controllers/user.controller";

export const userRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return signupUser(input);
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        rememberMe: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return loginUser(input);
    }),

  getMe: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.user);
    return ctx.user;
  }),

  logout: publicProcedure.mutation(() => {
    logoutUser();
  }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getUserById(input.id);
    }),

  getCountsData: protectedProcedure.query(async ({ ctx }) => {
    return await getTotalCountsForUser(ctx.user._id);
  }),

  updateProfilePic: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const result = await updateUserPicture(ctx.user._id, input);

      return result;
    }),

  updateDetails: protectedProcedure
    .input(
      z.object({
        first_name: z.string(),
        last_name: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateUserDetails(
        ctx.user._id,
        input.first_name,
        input.last_name,
        input.bio
      );
    }),

  updateSocialMedia: protectedProcedure
    .input(
      z.object({
        website: z.string(),
        twitter: z.string(),
        instagram: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateUserSocialMedia(
        ctx.user._id,
        input.website,
        input.twitter,
        input.instagram
      );
    }),

  getUsernameById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getUsernameById(input.id);
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updatePassword(
        ctx.user._id,
        input.oldPassword,
        input.newPassword
      );
    }),

  updateNotifications: protectedProcedure
    .input(
      z.object({
        comments: z.boolean(),
        likes: z.boolean(),
        follows: z.boolean(),
        messages: z.boolean(),
        marketing: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateNotifications(
        ctx.user._id,
        input.comments,
        input.likes,
        input.follows,
        input.messages,
        input.marketing
      );
    }),

  updatePrivacy: protectedProcedure

    .input(
      z.object({
        profile_visibility: z.boolean(),
        search_visibility: z.boolean(),
        comments: z.boolean(),
        data_collection: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updatePrivacy(
        ctx.user._id,
        input.profile_visibility,
        input.search_visibility,
        input.comments,
        input.data_collection
      );
    }),
});
