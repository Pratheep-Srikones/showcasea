import { router } from "@/lib/trpc/server";
import { userRouter } from "./routers/user.routes";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
