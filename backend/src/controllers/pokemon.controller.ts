import { getPokemons, getPokemonTypes } from "@/services/pokemon.service.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const pokemonController = new Hono()

pokemonController.get(
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

pokemonController.get("/types", async (c) => {
  const types = await getPokemonTypes()

  return c.json(types)
})

export default pokemonController
