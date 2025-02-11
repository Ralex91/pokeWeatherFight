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
