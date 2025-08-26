import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { env } from "cloudflare:workers";
import { reactStartCookies } from "better-auth/react-start";

export function createAuth() {
  return (
    betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",

        schema: schema,
      }),
      trustedOrigins: [env.CORS_ORIGIN],
      emailAndPassword: {
        enabled: true,
      },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      plugins: [reactStartCookies()],
      advanced: {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      }
    }))
}

