export type Move = {
  name: string
  power: number
  type: string
}

export type Pokemon = {
  id: number
  name: string
  types: string[]
  hp: number
  maxHp: number
  moves: Move[]
}

export enum PlayerType {
  PLAYER = "player",
  OPPONENT = "opponent",
}

export type Player = {
  name: string
  playedIndex: number
  pokemons: Pokemon[]
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
