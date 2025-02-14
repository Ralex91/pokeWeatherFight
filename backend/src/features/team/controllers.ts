import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { loggedCheck } from "../auth/middlewares.ts"
import { auth } from "../auth/services.ts"
import {
  checkPokemonInTeam,
  deleteFromTeam,
  getTeam,
  updateTeam,
} from "./repositories.ts"

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
    const { index, pokemonId } = c.req.valid("json")

    const isInTeam = await checkPokemonInTeam(user.id, pokemonId)

    if (isInTeam) {
      return c.json({ error: "Pokemon already in team" }, 400)
    }

    const result = await updateTeam(user.id, index, pokemonId)

    return c.json(result)
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
      return c.json({ error: "Unauthorized" }, 401)
    }

    const { index } = c.req.valid("json")

    await deleteFromTeam(user.id, index)

    return c.json({ message: "Pokemon removed from team" })
  }
)

export default router
