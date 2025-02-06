import {
  Action,
  ActionType,
  Battle,
  Move,
  Player,
  PlayerType,
  Pokemon,
  WeatherEffect,
} from "@/types/battle.ts"
import {
  GAME_INIT_STATE,
  TEAM_SIZE,
  WEATHER_ATTACK_MAP,
} from "@/utils/battle.ts"
import { getRandomPokemon } from "./pokemon.service.ts"
import { getWeatherCode } from "./weather.service.ts"

let gameState: Battle = structuredClone(GAME_INIT_STATE)
let messageFeed: string[] = []

const addMessage = (prefix: string, message: string) => {
  messageFeed.push(`${prefix}: ${message}`)
}

export const initBattle = async () => {
  gameState = structuredClone(GAME_INIT_STATE)
  gameState.player.pokemons = await Promise.all(
    Array.from({ length: TEAM_SIZE }, async () => await getRandomPokemon())
  )
  gameState.opponent.pokemons = await Promise.all(
    Array.from({ length: TEAM_SIZE }, async () => await getRandomPokemon())
  )
  return gameState
}

const getWeatherEffects = (weatherCode: number): WeatherEffect | null => {
  const weather = WEATHER_ATTACK_MAP.find((w) => w.codes.includes(weatherCode))

  return weather ? weather.effects : null
}

const calculateDamage = (
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
      gameState.opponent.name,
      `The weather is ${effect > 0 ? "strong" : "weak"} for the ${move.type} type, so ${effect > 0 ? "+" : "-"} ${effect} damage`
    )
  }

  if (attacker.types.includes(move.type)) {
    power *= 1.5
    addMessage(
      gameState.opponent.name,
      `The ${move.type} type matches ${attacker.name}'s type, so +50% power`
    )
  }

  return Math.floor(power)
}

const attack = async (
  attacker: Player,
  defender: Player,
  moveIndex: number
) => {
  const attackingPokemon = attacker.pokemons[attacker.playedIndex]
  const defendingPokemon = defender.pokemons[defender.playedIndex]
  const move = attackingPokemon.moves[moveIndex]

  const weatherCode = await getWeatherCode()
  const weatherEffects = getWeatherEffects(weatherCode)

  const damage = calculateDamage(move, attackingPokemon, weatherEffects)
  defendingPokemon.hp = Math.max(0, defendingPokemon.hp - damage)

  addMessage(attacker.name, `${attackingPokemon.name} uses ${move.name}`)
  addMessage(
    defender.name,
    `${defendingPokemon.name} loses ${damage} HP, ${defendingPokemon.hp} HP remaining`
  )

  return defendingPokemon.hp === 0
}

const switchPokemon = (player: Player, newIndex: number) => {
  if (
    newIndex >= 0 &&
    newIndex < player.pokemons.length &&
    player.pokemons[newIndex].hp > 0
  ) {
    player.playedIndex = newIndex
    addMessage(player.name, `Switching to ${player.pokemons[newIndex].name}!`)

    return true
  }

  return false
}

const checkGameOver = () => {
  const playerDefeated = gameState.player.pokemons.every((p) => p.hp === 0)
  const opponentDefeated = gameState.opponent.pokemons.every((p) => p.hp === 0)

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

  if (currentPokemon.hp < currentPokemon.maxHp * 0.2) {
    for (let i = 0; i < opponent.pokemons.length; i++) {
      if (i !== opponent.playedIndex && opponent.pokemons[i].hp > 0) {
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
  const isPlayer = gameState.turn === PlayerType.PLAYER
  const attacker = isPlayer ? gameState.player : gameState.opponent
  const defender = isPlayer ? gameState.opponent : gameState.player

  if (isPlayer) {
    messageFeed = []
  }

  if (action.type === ActionType.ATTACK) {
    const pokemonFainted = await attack(attacker, defender, action.value)

    if (pokemonFainted) {
      let nextIndex = defender.playedIndex + 1

      while (nextIndex < defender.pokemons.length) {
        if (defender.pokemons[nextIndex].hp > 0) {
          switchPokemon(defender, nextIndex)

          break
        }

        nextIndex++
      }
    }
  }

  if (action.type === ActionType.SWITCH) {
    switchPokemon(attacker, action.value)
  }

  if (!checkGameOver()) {
    gameState.turn = isPlayer ? PlayerType.OPPONENT : PlayerType.PLAYER

    if (gameState.turn === PlayerType.OPPONENT) {
      const aiAction: Action = aiChooseAction(gameState.opponent)
      await playTurn(aiAction)
    }
  }

  return {
    gameState,
    messages: messageFeed,
  }
}
