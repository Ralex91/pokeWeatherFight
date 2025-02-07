export type PokemonApiResponse = {
  id: number
  name: string
  types: {
    type: {
      name: string
    }
  }[]
  moves: {
    move: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
  }[]
}

export type MoveApiResponse = {
  name: string
  power: number
  type: {
    name: string
  }
}
