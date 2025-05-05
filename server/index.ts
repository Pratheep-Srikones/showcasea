import { router } from "@/lib/trpc/server";
import { userRouter } from "./routers/user.routes";
import { imageRouter } from "./routers/image.routes";
import { artWorkRouter } from "./routers/artwork.router";
import { likeRouter } from "./routers/like.router";
import { commentRouter } from "./routers/comment.routes";
import { followRouter } from "./routers/follow.router";
import { notificationRouter } from "./routers/notification.router";
import { chatRouter } from "./routers/chat.router";
import { messageRouter } from "./routers/message.router";

export const appRouter = router({
  user: userRouter,
  image: imageRouter,
  artWork: artWorkRouter,
  like: likeRouter,
  comment: commentRouter,
  follow: followRouter,
  notification: notificationRouter,
  chat: chatRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
