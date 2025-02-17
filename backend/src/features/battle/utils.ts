import { Move, Pokemon } from "@/features/pokemon/types.ts"
import { WEATHER_ATTACK_MAP } from "./constants.ts"
import { updateBattleWinner, updatePokemonIndex } from "./repositories.ts"
import { Battle, Player, WeatherEffect } from "./types.ts"

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
  attacker: Player,
  attackerPokemon: Pokemon,
  weatherEffects: WeatherEffect | null
) => {
  let power = move.power
  const { type } = move
  if (weatherEffects && weatherEffects[type]) {
    const effect = weatherEffects[type]

    power += effect
    addMessage(
      gameState,
      attacker.name,
      `The weather is ${effect > 0 ? "strong" : "weak"} for the ${
        move.type
      } type, so ${effect > 0 ? "+" : ""} ${effect} damage`
    )
  }

  if (attackerPokemon.types.map((t) => t.name).includes(type)) {
    power *= 1.5
    addMessage(
      gameState,
      attacker.name,
      `The ${move.type} type matches ${attackerPokemon.name}'s type, so +50% power`
    )
  }

  return Math.floor(power)
}

export const switchPokemon = async (
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
    await updatePokemonIndex(player.id, newIndex)

    addMessage(
      gameState,
      player.name,
      `Switching to ${player.pokemons[newIndex].name}!`
    )

    return true
  }

  return false
}

export const checkGameOver = async (gameState: Battle) => {
  const playerDefeated = gameState.player.pokemons.every(
    (p) => p.current_hp === 0
  )
  const opponentDefeated = gameState.opponent.pokemons.every(
    (p) => p.current_hp === 0
  )

  if (playerDefeated) {
    gameState.winner = gameState.opponent.name
    await updateBattleWinner(gameState.id, gameState.opponent.id)

    return true
  }

  if (opponentDefeated) {
    gameState.winner = gameState.player.name
    await updateBattleWinner(gameState.id, gameState.player.id)

    return true
  }

  return false
}
