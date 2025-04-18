import { publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import { loginUser, signupUser } from "../controllers/user.controller";

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
});
