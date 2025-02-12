import { db } from "@/lib/db.ts"
import { BattleStatus } from "@/types/db.ts"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { Battle, PlayerType, PokemonInBattle } from "./types.ts"

const addPlayerToBattle = async (
  battleId: number,
  playerId: string,
  playerType: PlayerType
) => {
  await db
    .insertInto("battle_player")
    .values({
      battle_id: battleId,
      user_id: playerId,
      player_type: playerType,
    })
    .execute()
}

export const getBattlePlayers = async (battleId: number) => {
  const players = await db
    .selectFrom("battle_player")
    .where("battle_id", "=", battleId)
    .select([
      "battle_player.user_id",
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "battle_player.user_id")
          .select(["user.name"])
          .as("player_name"),
      "battle_player.player_type",
      "battle_player.pokemon_index",
    ])
    .execute()

  const playersParsed = await Promise.all(
    players.map(async (player, i) => ({
      id: player.user_id,
      name: player.player_name || `Player ${i + 1}`,
      type: player.player_type,
      playedIndex: player.pokemon_index,
      pokemons: await getTeamInBattle(player.user_id, battleId),
    }))
  )

  return {
    player: playersParsed.find((p) => p.type === PlayerType.PLAYER)!,
    opponent: playersParsed.find((p) => p.type === PlayerType.OPPONENT)!,
  }
}

export const createBattle = async (playerId: string, opponentId: string) => {
  const [battle] = await db
    .insertInto("battle")
    .values({
      status: BattleStatus.PENDING,
    })
    .returning("id")
    .execute()

  await addPlayerToBattle(battle.id, playerId, PlayerType.PLAYER)
  await addPlayerToBattle(battle.id, opponentId, PlayerType.OPPONENT)

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
      "battle_pokemon.id",
      "pokemon.id as pokemon_id",
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
    .select([
      "battle.id",
      "battle.status",
      "battle.winner_id",
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "battle.winner_id")
          .select(["user.name"])
          .as("winner_name"),
    ])
    .executeTakeFirst()

  if (!battle) {
    return null
  }

  const { player, opponent } = await getBattlePlayers(battleId)

  return {
    id: battle.id,
    turn: PlayerType.PLAYER,
    winner: battle.winner_name,
    player,
    opponent,
    messages: [],
  }
}

export const updatePokemonHp = async (pokemonBattleId: number, newHp: number) =>
  await db
    .updateTable("battle_pokemon")
    .where("id", "=", pokemonBattleId)
    .set({
      current_hp: newHp,
    })
    .execute()

export const updatePokemonIndex = async (playerId: string, index: number) => {
  await db
    .updateTable("battle_player")
    .where("user_id", "=", playerId)
    .set({
      pokemon_index: index,
    })
    .execute()
}

export const updateBattleWinner = async (
  battleId: number,
  winnerId: string
) => {
  await db
    .updateTable("battle")
    .where("id", "=", battleId)
    .set({
      status: BattleStatus.FINISHED,
      winner_id: winnerId,
    })
    .execute()
}
