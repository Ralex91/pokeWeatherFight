import { Pokemon } from "@/features/pokemon/types"
import { getPokemonImage } from "@/features/pokemon/utils"
import Image from "next/image"

type Props = {
  pokemon: Pokemon
  onClick: () => void
}

const PokemonCard = ({ pokemon, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-1 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 p-1"
    >
      <Image
        height={80}
        width={80}
        src={getPokemonImage(pokemon.id)}
        alt={pokemon.name}
      />
      <div className="text-left">
        <p className="text-lg font-semibold capitalize">{pokemon.name}</p>
        <p>HP: {pokemon.maxHp}</p>
        <p className="text-sm capitalize text-gray-600">
          {pokemon.types.map((t) => t.name).join(", ")}
        </p>
      </div>
    </button>
  )
}

export default PokemonCard
