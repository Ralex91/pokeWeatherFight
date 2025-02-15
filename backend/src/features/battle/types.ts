import { Pokemon } from "@/features/pokemon/types.ts"

export interface PokemonInBattle extends Pokemon {
  pokemon_id: number
  current_hp: number
}

export interface TeamPokemon {
  id: number
  maxHp: number
  position: number
}

export enum PlayerType {
  PLAYER = "player",
  OPPONENT = "opponent",
}

export type Player = {
  id: string
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
  winner: string | null
  player: Player
  opponent: Player
  messages: string[]
}

export type WeatherEffect = {
  [key: string]: number
}

export type WeatherAttackMap = {
  name: string
  codes: number[]
  effects: WeatherEffect
}
