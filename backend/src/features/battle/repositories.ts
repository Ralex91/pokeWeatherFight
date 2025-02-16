import { db } from "@/lib/db.ts"
import { BattleStatus } from "@/types/db.ts"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { Battle, PlayerType, PokemonInBattle, TeamPokemon } from "./types.ts"

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

const getPlayerTeam = async (userId: string): Promise<TeamPokemon[]> => {
  return await db
    .selectFrom("team")
    .innerJoin("pokemon", "pokemon.id", "team.pokemon_id")
    .where("team.user_id", "=", userId)
    .select(["pokemon.id", "pokemon.maxHp", "team.position"])
    .execute()
}

const formatPokemonToBattle = (
  battleId: number,
  userId: string,
  pokemons: TeamPokemon[]
) =>
  pokemons.map((pokemon) => ({
    battle_id: battleId,
    pokemon_id: pokemon.id,
    user_id: userId,
    current_hp: pokemon.maxHp,
  }))

export const createBattle = async (playerId: string, opponentId: string) => {
  const [player1Team, player2Team] = await Promise.all([
    getPlayerTeam(playerId),
    getPlayerTeam(opponentId),
  ])

  if (!player1Team.length || !player2Team.length) {
    throw new Error("Invalid team")
  }

  const battleId = await db.transaction().execute(async (trx) => {
    const battle = await trx
      .insertInto("battle")
      .values({
        status: BattleStatus.PENDING,
      })
      .returning("id")
      .executeTakeFirst()

    if (!battle) {
      throw new Error("Failed to create battle")
    }

    await trx
      .insertInto("battle_player")
      .values([
        {
          battle_id: battle.id,
          user_id: playerId,
          player_type: PlayerType.PLAYER,
        },
        {
          battle_id: battle.id,
          user_id: opponentId,
          player_type: PlayerType.OPPONENT,
        },
      ])
      .execute()

    const battlePokemons = [
      ...formatPokemonToBattle(battle.id, playerId, player1Team),
      ...formatPokemonToBattle(battle.id, opponentId, player2Team),
    ]

    await trx.insertInto("battle_pokemon").values(battlePokemons).execute()

    return battle.id
  })

  return battleId
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

export const getUserBattles = async (userId: string) => {
  const battles = await db
    .selectFrom("battle")
    .innerJoin("battle_player as my_entry", "my_entry.battle_id", "battle.id")
    .leftJoin("battle_player as other_entry", (join) =>
      join
        .onRef("other_entry.battle_id", "=", "battle.id")
        .on("other_entry.user_id", "!=", userId)
    )
    .where("my_entry.user_id", "=", userId)
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
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "my_entry.user_id")
          .select(["user.name"])
          .as("my_name"),
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "other_entry.user_id")
          .select(["user.name"])
          .as("other_name"),
    ])
    .orderBy("battle.id", "desc")
    .execute()

  return battles.map((b) => ({
    id: b.id,
    status: !b.winner_id ? "pending" : b.winner_id === userId ? "win" : "lose",
    winner: b.winner_name,
    player: b.my_name,
    opponent: b.other_name,
  }))
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
