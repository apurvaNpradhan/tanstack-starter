import type { Context as HonoContext } from "hono";
import { db } from "@/db";
import { createAuth } from "./auth";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const auth = createAuth()
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
    db
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
