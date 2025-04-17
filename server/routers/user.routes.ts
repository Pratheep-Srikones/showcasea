import { publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";
import { signupUser } from "../controllers/user.controller";

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
});
