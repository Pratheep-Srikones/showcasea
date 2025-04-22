import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/index";
import { connectDB } from "@/lib/db/mongoose";
import { createContext } from "@/lib/trpc/context";

const handler = async (req: Request) => {
  await connectDB();
  return fetchRequestHandler({
    endpoint: "api/trpc",
    req,
    router: appRouter,
    createContext: createContext,
  });
};

export { handler as GET, handler as POST };
