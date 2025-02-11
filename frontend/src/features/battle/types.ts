import { Pokemon } from "@/features/pokemon/types"

export interface PokemonInBattle extends Pokemon {
  current_hp: number
}

export enum PlayerType {
  PLAYER = "player",
  OPPONENT = "opponent",
}

export type Player = {
  name: string
  playedIndex: number
  pokemons: PokemonInBattle[]
}

export enum ActionType {
  ATTACK = "attack",
  SWITCH = "switch",
}

export type Action = { type: ActionType; value: number }

export type Battle = {
  turn: PlayerType
  winner: PlayerType | null
  player: Player
  opponent: Player
  messages: string[]
}

export enum BattleStuts {
  IN_PROGRESS = "In progress",
  WIN = "Win",
  LOSE = "Lose",
}
