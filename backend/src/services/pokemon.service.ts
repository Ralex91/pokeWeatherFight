import { Pokemon } from "@/types/battle.ts"
import { MoveApiResponse, PokemonApiResponse } from "@/types/pokemon.ts"
import ky from "ky"

export const getRandomPokemon: () => Promise<Pokemon> = async () => {
  const id = Math.floor(Math.random() * 898) + 1
  const response: PokemonApiResponse = await ky
    .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .json()

  const moves = await Promise.all(
    response.moves.slice(0, 4).map(async (m) => {
      const moveData: MoveApiResponse = await ky.get(m.move.url).json()
      return {
        name: m.move.name,
        power: moveData.power || 40,
        type: moveData.type.name,
      }
    })
  )

  return {
    name: response.name,
    types: response.types.map((t) => t.type.name),
    hp: response.stats[0].base_stat * 2,
    maxHp: response.stats[0].base_stat * 2,
    moves,
  }
}
