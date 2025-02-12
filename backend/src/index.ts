import authController from "@/features/auth/controllers.ts"
import { authMiddleware } from "@/features/auth/middlewares.ts"
import battleController from "@/features/battle/controllers.ts"
import friendController from "@/features/friend/controllers.ts"
import pokemonController from "@/features/pokemon/controllers.ts"
import teamController from "@/features/team/controllers.ts"
import env from "@/lib/env.ts"
import { HonoContext } from "@/types/hono.ts"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono<HonoContext>()

app.use(
  cors({
    origin: [env.BETTER_AUTH_URL],
    credentials: true,
  })
)

app.use("*", authMiddleware)

app.get("/", async (c) => {
  const session = c.get("user")

  return c.text(`Welcome to Hono ${session ? session.name : "Guest"}!`)
})

app
  .basePath("/api")
  .route("/auth", authController)
  .route("/battle", battleController)
  .route("/pokemon", pokemonController)
  .route("/team", teamController)
  .route("/friend", friendController)

console.log(`Server is running on http://localhost:${env.PORT}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
