import { router } from "@/lib/trpc/server";
import { userRouter } from "./routers/user.routes";
import { imageRouter } from "./routers/image.routes";
import { artWorkRouter } from "./routers/artwork.router";
import { likeRouter } from "./routers/like.router";

export const appRouter = router({
  user: userRouter,
  image: imageRouter,
  artWork: artWorkRouter,
  like: likeRouter,
});

export type AppRouter = typeof appRouter;
