import { publicProcedure, router } from "@/lib/trpc/server";
import { z } from "zod";

export const userRouter = router({
  getUser: publicProcedure.input(z.string()).query(async (input) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id: input, name: "test" };
  }),
});
