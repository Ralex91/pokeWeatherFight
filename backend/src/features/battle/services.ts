import { getWeatherCode } from "@/features/weather/services.ts"
import { updatePokemonHp } from "./repositories.ts"
import { Action, ActionType, Battle, Player, PlayerType } from "./types.ts"
import {
  addMessage,
  calculateDamage,
  checkGameOver,
  getWeatherEffects,
  switchPokemon,
} from "./utils.ts"

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
    attacker,
    attackingPokemon,
    weatherEffects
  )
  const newHp = Math.max(0, defendingPokemon.current_hp - damage)

  await updatePokemonHp(defendingPokemon.id, newHp)
  defendingPokemon.current_hp = newHp

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

export const playTurn = async (battle: Battle, action: Action) => {
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
          await switchPokemon(battle, defender, nextIndex)

          break
        }

        nextIndex++
      }
    }
  }

  if (action.type === ActionType.SWITCH) {
    await switchPokemon(battle, attacker, action.value)
  }

  if (!(await checkGameOver(battle))) {
    battle.turn = isPlayer ? PlayerType.OPPONENT : PlayerType.PLAYER

    if (battle.turn === PlayerType.OPPONENT) {
      const aiAction: Action = aiChooseAction(battle.opponent)
      await playTurn(battle, aiAction)
    }
  }

  return battle
}
