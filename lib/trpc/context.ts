import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { getUserById } from "@/server/controllers/user.controller";

export async function createContext() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let user = null;
  if (token) {
    try {
      const decoded = verifyToken(token);
      user = await getUserById(decoded.id);
    } catch (err) {
      user = null;
    }
  }

  return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
