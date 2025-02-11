import { db } from "@/lib/db.ts"
import { BattleStatus } from "@/types/db.ts"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { Battle, PlayerType, PokemonInBattle } from "./types.ts"

export const createBattle = async (playerId: string, opponentId: string) => {
  const [battle] = await db
    .insertInto("battle")
    .values({
      player1_id: playerId,
      player2_id: opponentId,
      status: BattleStatus.PENDING,
    })
    .returning("id")
    .execute()

  const player1Team = await db
    .selectFrom("team")
    .innerJoin("pokemon", "pokemon.id", "team.pokemon_id")
    .where("team.user_id", "=", playerId)
    .select(["pokemon.id", "pokemon.maxHp", "team.position"])
    .execute()

  const player2Team = await db
    .selectFrom("team")
    .innerJoin("pokemon", "pokemon.id", "team.pokemon_id")
    .where("team.user_id", "=", opponentId)
    .select(["pokemon.id", "pokemon.maxHp", "team.position"])
    .execute()

  await Promise.all([
    ...player1Team.map((pokemon) =>
      db
        .insertInto("battle_pokemon")
        .values({
          battle_id: battle.id,
          pokemon_id: pokemon.id,
          user_id: playerId,
          current_hp: pokemon.maxHp,
        })
        .execute()
    ),
    ...player2Team.map((pokemon) =>
      db
        .insertInto("battle_pokemon")
        .values({
          battle_id: battle.id,
          pokemon_id: pokemon.id,
          user_id: opponentId,
          current_hp: pokemon.maxHp,
        })
        .execute()
    ),
  ])

  return battle.id
}

export const getTeamInBattle = async (
  userId: string,
  battleId: number
): Promise<PokemonInBattle[]> => {
  const team = await db
    .selectFrom("battle_pokemon")
    .innerJoin("pokemon", "pokemon.id", "battle_pokemon.pokemon_id")
    .where("battle_pokemon.user_id", "=", userId)
    .where("battle_pokemon.battle_id", "=", battleId)
    .select([
      "pokemon.id",
      "pokemon.name",
      "pokemon.maxHp",
      "battle_pokemon.current_hp",
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
    .execute()

  return team
}

export async function getBattle(battleId: number): Promise<Battle | null> {
  const battle = await db
    .selectFrom("battle")
    .where("battle.id", "=", battleId)
    .selectAll()
    .executeTakeFirst()

  if (!battle) {
    return null
  }

  return {
    turn: PlayerType.PLAYER,
    winner: null,
    player: {
      name: "Player",
      playedIndex: 0,
      pokemons: await getTeamInBattle("player", battleId),
    },
    opponent: {
      name: "Opponent",
      playedIndex: 0,
      pokemons: await getTeamInBattle("opponent", battleId),
    },
    messages: [],
  }
}
