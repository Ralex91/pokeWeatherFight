import { Move, Pokemon } from "@/features/pokemon/types.ts"
import {
  Battle,
  Player,
  PlayerType,
  WeatherAttackMap,
  WeatherEffect,
} from "./types.ts"

export const TEAM_SIZE = 6

export const GAME_INIT_STATE: Battle = {
  turn: PlayerType.PLAYER,
  winner: null,
  player: {
    name: "Player",
    playedIndex: 0,
    pokemons: [],
  },
  opponent: {
    name: "Opponent",
    playedIndex: 0,
    pokemons: [],
  },
  messages: [],
}

export const WEATHER_ATTACK_MAP: WeatherAttackMap[] = [
  {
    name: "rain",
    codes: [61, 63, 65, 80, 81, 82],
    effects: { fire: -10, water: +10 },
  },
  { name: "sun", codes: [0, 1], effects: { fire: +10, ice: -10 } },
  {
    name: "snow",
    codes: [71, 73, 75, 85, 86],
    effects: { ice: +10, grass: -10 },
  },
]

export const addMessage = (
  gameState: Battle,
  prefix: string,
  message: string
) => {
  gameState.messages.push(`${prefix}: ${message}`)
}

export const getWeatherEffects = (
  weatherCode: number
): WeatherEffect | null => {
  const weather = WEATHER_ATTACK_MAP.find((w) => w.codes.includes(weatherCode))

  return weather ? weather.effects : null
}

export const calculateDamage = (
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
      `The weather is ${effect > 0 ? "strong" : "weak"} for the ${
        move.type
      } type, so ${effect > 0 ? "+" : "-"} ${effect} damage`
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

export const switchPokemon = (
  gameState: Battle,
  player: Player,
  newIndex: number
) => {
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

export const checkGameOver = (gameState: Battle) => {
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
