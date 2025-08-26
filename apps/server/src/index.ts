import { env } from "cloudflare:workers";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuth } from "./lib/auth";

const app = new Hono();
let authInstance: ReturnType<typeof createAuth> | null = null;

app.use(logger());

app.use(
  "/*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "https://tanstack-starter.apurvanarayanpradhan.workers.dev",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
      ];
      console.log(`CORS Origin Check: ${origin} -> ${allowedOrigins.includes(origin) ? origin : '*'}`);
      return allowedOrigins.includes(origin) ? origin : '*';
    },
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-trpc-source",
      "X-Requested-With",
      "cache-control",
      "pragma",
      "x-tsr-redirect",
    ],
    credentials: true,
    exposeHeaders: ["set-cookie", "x-trpc-source"],
    maxAge: 86400,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  if (!authInstance) {
    authInstance = createAuth();
  }
  return authInstance.handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      console.log("tRPC Context Created with Headers:", context.req.raw.headers);
      return createContext({ context });
    },
  })
);

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/debug/cors", (c) => {
  const origin = c.req.header("origin");
  const headers = Object.fromEntries(c.req.raw.headers.entries());
  return c.json({
    origin,
    headers,
    message: "CORS debug endpoint",
  });
});

app.get("/test-cors", (c) => {
  return c.json({ message: "CORS test" });
});

export default app;
