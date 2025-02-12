import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { loggedCheck } from "../auth/middlewares.ts"
import { auth } from "../auth/services.ts"
import { deleteFromTeam, getTeam, updateTeam } from "./repositories.ts"

const router = new Hono<HonoContext>()

router.use("/*", loggedCheck)

router.get("/", async (c) => {
  const user = c.get("user") as typeof auth.$Infer.Session.user
  const team = await getTeam(user.id)

  return c.json(team)
})

router.patch(
  "/",
  zValidator(
    "json",
    z.object({
      index: z.number().min(1).max(6),
      pokemonId: z.number(),
    })
  ),
  async (c) => {
    const user = c.get("user") as typeof auth.$Infer.Session.user

    try {
      const { index, pokemonId } = c.req.valid("json")
      const result = await updateTeam({
        userId: user.id,
        index,
        pokemonId,
      })

      return c.json(result)
    } catch (error) {
      if (error instanceof Error && error.message === "Already in team") {
        return c.json({ error: error.message }, 400)
      }

      throw error
    }
  }
)

router.delete(
  "/",
  zValidator(
    "json",
    z.object({
      index: z.number().min(1).max(6),
    })
  ),
  async (c) => {
    const user = c.get("user")

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    const { index } = c.req.valid("json")

    await deleteFromTeam({
      userId: user.id,
      index,
    })

    return c.json({ message: "Pokemon removed from team" })
  }
)

export default router
