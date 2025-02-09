import { db } from "@/lib/db.ts"
import { Pokemon } from "@/types/battle.ts"
import { jsonArrayFrom } from "kysely/helpers/postgres"

interface Params {
  name?: string
  type?: string
  limit?: number
  page?: number
}

export const getPokemons = async ({
  name,
  type,
  limit = 10,
  page,
}: Params = {}) => {
  let query = db
    .selectFrom("pokemon")
    .select([
      "pokemon.id",
      "pokemon.name",
      "pokemon.maxHp",
      (eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("pokemon_type")
            .innerJoin("type", "type.id", "pokemon_type.type_id")
            .whereRef("pokemon_type.pokemon_id", "=", "pokemon.id")
            .select(["type.id", "type.name"])
        ).as("types"),
      (eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("pokemon_move")
            .innerJoin("move", "move.id", "pokemon_move.move_id")
            .innerJoin("type", "type.id", "move.type_id")
            .whereRef("pokemon_move.pokemon_id", "=", "pokemon.id")
            .select(["move.id", "move.name", "move.power", "type.name"])
        ).as("moves"),
    ])

  if (name) {
    query = query.where("pokemon.name", "ilike", `%${name}%`)
  }

  if (type) {
    query = query
      .innerJoin("pokemon_type", "pokemon_type.pokemon_id", "pokemon.id")
      .innerJoin("type", "type.id", "pokemon_type.type_id")
      .where("type.name", "=", type)
  }

  if (limit && !isNaN(limit)) {
    query = query.limit(limit)
  }

  if (page && !isNaN(page)) {
    query = query.offset((page - 1) * limit)
  }

  const pokemons = await query.execute()
  return pokemons
}

export const getPokemon = async (id: number): Promise<Pokemon | undefined> => {
  const query = await db
    .selectFrom("pokemon")
    .where("pokemon.id", "=", id)
    .select([
      "pokemon.id",
      "pokemon.name",
      "pokemon.maxHp",
      (eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("pokemon_type")
            .innerJoin("type", "type.id", "pokemon_type.type_id")
            .whereRef("pokemon_type.pokemon_id", "=", "pokemon.id")
            .select(["type.id", "type.name"])
        ).as("types"),
      (eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("pokemon_move")
            .innerJoin("move", "move.id", "pokemon_move.move_id")
            .innerJoin("type", "type.id", "move.type_id")
            .whereRef("pokemon_move.pokemon_id", "=", "pokemon.id")
            .select(["move.id", "move.name", "move.power", "type.name as type"])
        ).as("moves"),
    ])
    .executeTakeFirst()

  return query
}

export const getPokemonTypes = async () => {
  const types = await db
    .selectFrom("type")
    .select(["name"])
    .distinct()
    .execute()

  return types.map((t) => t.name)
}
