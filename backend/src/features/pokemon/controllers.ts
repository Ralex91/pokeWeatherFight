import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { loggedCheck } from "../auth/middlewares.ts"
import { getPokemons, getPokemonTypes } from "./repositories.ts"

const router = new Hono()

router.use("/*", loggedCheck)

router.get(
  "/",
  zValidator(
    "query",
    z.object({
      search: z.string().optional(),
      type: z.string().optional(),
      limit: z.string().optional().transform(Number),
      page: z.string().optional().transform(Number),
    })
  ),
  async (c) => {
    const { search, type, limit, page } = c.req.valid("query")

    const pokemons = await getPokemons({
      name: search,
      type,
      limit,
      page,
    })

    return c.json(pokemons)
  }
)

router.get("/types", async (c) => {
  const types = await getPokemonTypes()

  return c.json(types)
})

export default router
