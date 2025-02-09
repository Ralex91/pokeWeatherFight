import { db } from "@/lib/db.ts"
import {
  Action,
  ActionType,
  Battle,
  Move,
  Player,
  PlayerType,
  Pokemon,
  PokemonInBattle,
  WeatherEffect,
} from "@/types/battle.ts"
import { BattleStatus } from "@/types/db.ts"
import { WEATHER_ATTACK_MAP } from "@/utils/battle.ts"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { getWeatherCode } from "./weather.service.ts"

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

const addMessage = (gameState: Battle, prefix: string, message: string) => {
  gameState.messages.push(`${prefix}: ${message}`)
}
const getWeatherEffects = (weatherCode: number): WeatherEffect | null => {
  const weather = WEATHER_ATTACK_MAP.find((w) => w.codes.includes(weatherCode))

  return weather ? weather.effects : null
}

const calculateDamage = (
  gameState: Battle,
  move: Move,
  attacker: Pokemon,
  weatherEffects: WeatherEffect | null
) => {
  let power = move.power
  const { type } = move

  if (weatherEffects) {
    const effect = weatherEffects[type]

    power += effect
    addMessage(
      gameState,
      gameState.opponent.name,
      `The weather is ${effect > 0 ? "strong" : "weak"} for the ${move.type} type, so ${effect > 0 ? "+" : "-"} ${effect} damage`
    )
  }

  if (attacker.types.map((t) => t.name).includes(type)) {
    power *= 1.5
    addMessage(
      gameState,
      gameState.opponent.name,
      `The ${move.type} type matches ${attacker.name}'s type, so +50% power`
    )
  }

  return Math.floor(power)
}

const attack = async (
  gameState: Battle,
  attacker: Player,
  defender: Player,
  moveIndex: number
) => {
  const attackingPokemon = attacker.pokemons[attacker.playedIndex]
  const defendingPokemon = defender.pokemons[defender.playedIndex]
  const move = attackingPokemon.moves[moveIndex]

  const weatherCode = await getWeatherCode()
  const weatherEffects = getWeatherEffects(weatherCode)

  const damage = calculateDamage(
    gameState,
    move,
    attackingPokemon,
    weatherEffects
  )
  defendingPokemon.current_hp = Math.max(
    0,
    defendingPokemon.current_hp - damage
  )

  addMessage(
    gameState,
    attacker.name,
    `${attackingPokemon.name} uses ${move.name}`
  )
  addMessage(
    gameState,
    defender.name,
    `${defendingPokemon.name} loses ${damage} HP, ${defendingPokemon.current_hp} HP remaining`
  )

  return defendingPokemon.current_hp === 0
}

const switchPokemon = (gameState: Battle, player: Player, newIndex: number) => {
  if (
    newIndex >= 0 &&
    newIndex < player.pokemons.length &&
    player.pokemons[newIndex].current_hp > 0
  ) {
    player.playedIndex = newIndex
    addMessage(
      gameState,
      player.name,
      `Switching to ${player.pokemons[newIndex].name}!`
    )

    return true
  }

  return false
}

const checkGameOver = (gameState: Battle) => {
  const playerDefeated = gameState.player.pokemons.every(
    (p) => p.current_hp === 0
  )
  const opponentDefeated = gameState.opponent.pokemons.every(
    (p) => p.current_hp === 0
  )

  if (playerDefeated) {
    gameState.winner = PlayerType.OPPONENT

    return true
  }

  if (opponentDefeated) {
    gameState.winner = PlayerType.PLAYER

    return true
  }

  return false
}

// "AI" Hahaha
const aiChooseAction = (opponent: Player): Action => {
  const currentPokemon = opponent.pokemons[opponent.playedIndex]

  if (currentPokemon.current_hp < currentPokemon.maxHp * 0.2) {
    for (let i = 0; i < opponent.pokemons.length; i++) {
      if (i !== opponent.playedIndex && opponent.pokemons[i].current_hp > 0) {
        return { type: ActionType.SWITCH, value: i }
      }
    }
  }

  const moveIndex = Math.floor(Math.random() * currentPokemon.moves.length)

  return {
    type: ActionType.ATTACK,
    value: moveIndex,
  }
}

export const playTurn = async (action: Action) => {
  const battle = await getBattle(1)

  if (!battle) {
    throw new Error("Battle not found")
  }

  const isPlayer = battle.turn === PlayerType.PLAYER
  const attacker = isPlayer ? battle.player : battle.opponent
  const defender = isPlayer ? battle.opponent : battle.player

  if (isPlayer) {
    battle.messages = []
  }

  if (action.type === ActionType.ATTACK) {
    const pokemonFainted = await attack(
      battle,
      attacker,
      defender,
      action.value
    )

    if (pokemonFainted) {
      let nextIndex = defender.playedIndex + 1

      while (nextIndex < defender.pokemons.length) {
        if (defender.pokemons[nextIndex].current_hp > 0) {
          switchPokemon(battle, defender, nextIndex)

          break
        }

        nextIndex++
      }
    }
  }

  if (action.type === ActionType.SWITCH) {
    switchPokemon(battle, attacker, action.value)
  }

  if (!checkGameOver(battle)) {
    battle.turn = isPlayer ? PlayerType.OPPONENT : PlayerType.PLAYER

    if (battle.turn === PlayerType.OPPONENT) {
      const aiAction: Action = aiChooseAction(battle.opponent)
      await playTurn(aiAction)
    }
  }

  return battle
}
