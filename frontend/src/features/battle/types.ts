import { Pokemon } from "@/features/pokemon/types"

export interface PokemonInBattle extends Pokemon {
  pokemon_id: number
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
  id: number
  turn: PlayerType
  winner: PlayerType | null
  player: Player
  opponent: Player
  messages: string[]
}

export type BattleList = {
  id: number
  status: BattleStuts
  winner: string | null
  player: string
  opponent: string
}

export enum BattleStuts {
  IN_PROGRESS = "pending",
  WIN = "win",
  LOSE = "lose",
}
