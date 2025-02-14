import { getPokemon } from "@/features/pokemon/repositories.ts"
import { Pokemon } from "@/features/pokemon/types.ts"
import { db } from "@/lib/db.ts"
import { sql } from "kysely"

export const getTeam = async (userId: string): Promise<Pokemon[]> => {
  const team = await db
    .selectFrom("team")
    .where("user_id", "=", userId)
    .selectAll()
    .orderBy("position", "asc")
    .execute()

  const pokemons = await Promise.all(
    team.map(async (pokemon) => {
      return await getPokemon(pokemon.pokemon_id)
    })
  )

  return pokemons.filter(
    (p: Pokemon | undefined): p is Pokemon => p !== undefined
  )
}

export async function checkPokemonInTeam(
  userId: string,
  pokemonId: number
): Promise<boolean> {
  const isAlreadyInTeam = await db
    .selectFrom("team")
    .where("user_id", "=", userId)
    .where("pokemon_id", "=", pokemonId)
    .selectAll()
    .execute()

  return isAlreadyInTeam.length > 0
}

export async function checkPositionExists(
  userId: string,
  position: number
): Promise<boolean> {
  const isIndexExists = await db
    .selectFrom("team")
    .where("user_id", "=", userId)
    .where("position", "=", position)
    .selectAll()
    .execute()

  return isIndexExists.length > 0
}

export async function updateTeamPosition(
  userId: string,
  index: number,
  pokemonId: number
) {
  const positionExists = await checkPositionExists(userId, index)

  if (positionExists) {
    return db
      .updateTable("team")
      .where("user_id", "=", userId)
      .where("position", "=", index)
      .set({ pokemon_id: pokemonId })
      .returningAll()
      .execute()
  }

  return db
    .insertInto("team")
    .values({ user_id: userId, position: index, pokemon_id: pokemonId })
    .returningAll()
    .execute()
}

export async function updateTeam(
  userId: string,
  index: number,
  pokemonId: number
) {
  await updateTeamPosition(userId, index, pokemonId)
  const pokemon = await getPokemon(pokemonId)

  return {
    pokemon,
    releaseIndex: index,
  }
}

export async function deleteFromTeam(userId: string, index: number) {
  await db
    .deleteFrom("team")
    .where("user_id", "=", userId)
    .where("position", "=", index)
    .returningAll()
    .execute()

  return db
    .updateTable("team")
    .where("user_id", "=", userId)
    .where("position", ">", index)
    .set({ position: sql`position - 1` })
    .returningAll()
    .execute()
}
