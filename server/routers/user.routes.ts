import { protectedProcedure, publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import {
  getUserById,
  loginUser,
  logoutUser,
  signupUser,
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
      console.log("Input data:", input);
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
      console.log("Input data:", input);
      console.log(loginUser(input));
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
      console.log("Input data:", input);
      return await getUserById(input.id);
    }),
});
