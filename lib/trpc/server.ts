import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;

export const isAuthed = trpc.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("UNAUTHORIZED");
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = trpc.procedure.use(isAuthed);
