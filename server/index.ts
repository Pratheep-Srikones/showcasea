import { router } from "@/lib/trpc/server";
import { userRouter } from "./routers/user.routes";
import { imageRouter } from "./routers/image.routes";
import { artWorkRouter } from "./routers/artwork.router";
import { likeRouter } from "./routers/like.router";
import { commentRouter } from "./routers/comment.routes";

export const appRouter = router({
  user: userRouter,
  image: imageRouter,
  artWork: artWorkRouter,
  like: likeRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
