import { router } from "@/lib/trpc/server";
import { userRouter } from "./routers/user.routes";
import { imageRouter } from "./routers/image.routes";

export const appRouter = router({
  user: userRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;
