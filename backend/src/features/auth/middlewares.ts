import { Context, Next } from "hono"
import { auth } from "./services.ts"

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

export const loggedCheck = async (c: Context, next: Next) => {
  const session = c.get("session")

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401)
  }

  return next()
}
