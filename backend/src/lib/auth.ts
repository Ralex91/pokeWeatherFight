import { betterAuth } from "better-auth"
import { Context, Next } from "hono"
import { dialect } from "./db.js"
import env from "./env.ts"

export const auth = betterAuth({
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: {
    dialect,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
})

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set("user", null)
    c.set("session", null)
    return next()
  }

  c.set("user", session.user)
  c.set("session", session.session)

  return next()
}
