export type Move = {
  name: string
  power: number
  type: string
}

export type PokemonType = {
  id: number
  name: string
}

export type Pokemon = {
  id: number
  name: string
  types: PokemonType[]
  maxHp: number
  moves: Move[]
}

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

export type WeatherEffect = {
  [key: string]: number
}

export type WeatherAttackMap = {
  name: string
  codes: number[]
  effects: WeatherEffect
}
