export type PokemonApiResponse = {
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
