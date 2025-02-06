import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { auth, authMiddleware } from "./lib/auth.ts"
import env from "./lib/env.ts"
import { HonoContext } from "./types/hono.ts"

const app = new Hono<HonoContext>()

app.use(
  cors({
    origin: [env.BETTER_AUTH_URL],
    credentials: true,
  })
)

app.use("*", authMiddleware)
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))

app.get("/", async (c) => {
  const session = c.get("user")

  return c.text(`Welcome to Hono ${session ? session.name : "Guest"}!`)
})

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
