import { Database } from "@/types/db.ts"
import ky from "ky"
import type { Kysely } from "kysely"

interface PokemonAPI {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
  moves: Array<{ move: { name: string; url: string } }>
  stats: Array<{ base_stat: number; stat: { name: string } }>
}

interface MoveAPI {
  name: string
  power: number | null
  type: { name: string }
}

export async function seed(db: Kysely<Database>): Promise<void> {
  try {
    console.log("🌱 Seeding types and pokemons...")

    const typeCache = new Map<string, number>()
    const moveCache = new Map<string, number>()

    async function getTypeId(typeName: string): Promise<number> {
      let typeId = typeCache.get(typeName)
      if (!typeId) {
        const [insertedType] = await db
          .insertInto("type")
          .values({
            name: typeName,
          })
          .returning("id")
          .execute()
        typeId = insertedType.id
        typeCache.set(typeName, typeId as number)
      }
      return typeId
    }

    for (let i = 1; i <= 151; i++) {
      const pokemonData = await ky
        .get<PokemonAPI>(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .json()

      const baseHp =
        pokemonData.stats.find((stat) => stat.stat.name === "hp")?.base_stat ||
        100

      await db
        .insertInto("pokemon")
        .values({
          id: pokemonData.id,
          name: pokemonData.name,
          maxHp: baseHp,
        })
        .execute()

      for (const type of pokemonData.types) {
        const typeId = await getTypeId(type.type.name)
        await db
          .insertInto("pokemon_type")
          .values({
            pokemon_id: pokemonData.id,
            type_id: typeId,
          })
          .execute()
      }

      const pokemonMoves = pokemonData.moves.slice(0, 4)
      for (const moveData of pokemonMoves) {
        let moveId = moveCache.get(moveData.move.name)
        if (!moveId) {
          const moveDetails = await ky.get<MoveAPI>(moveData.move.url).json()
          if (moveDetails.power === null) {
            continue
          }

          const moveTypeId = await getTypeId(moveDetails.type.name)

          const [insertedMove] = await db
            .insertInto("move")
            .values({
              name: moveDetails.name,
              power: moveDetails.power || 0,
              type_id: moveTypeId,
            })
            .returning("id")
            .execute()
          moveId = insertedMove.id
          moveCache.set(moveData.move.name, moveId as number)
        }

        await db
          .insertInto("pokemon_move")
          .values({
            pokemon_id: pokemonData.id,
            move_id: moveId,
          })
          .execute()
      }

      console.log(`✅ Seeded the Pokémon ${pokemonData.name} (${i}/151)`)
    }
    console.log("✅ Types and Pokemons seeded")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    throw error
  }
}
