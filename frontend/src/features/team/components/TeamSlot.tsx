"use client"

import { Pokemon } from "@/features/pokemon/types"
import { getPokemonImage } from "@/features/pokemon/utils"
import { useQueryClient } from "@tanstack/react-query"
import { Plus, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import { useDeleteFromTeam } from "./../services"

type Props = {
  slotId: number
  pokemon?: Pokemon
}

const TeamSlot = ({ slotId, pokemon }: Props) => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useDeleteFromTeam(queryClient)

  const handleDeleteFromTeam = (index: number) => async () => {
    await mutateAsync(index)
    toast.success("Pokemon removed from team")
  }

  return (
    <div className="relative">
      {pokemon && (
        <button
          onClick={handleDeleteFromTeam(slotId)}
          className="absolute top-0 right-0 p-2 z-10 hover:text-red-500"
        >
          <X size={20} />
        </button>
      )}

      <Link
        href={`/game/team/${slotId}`}
        className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-1 relative h-36"
      >
        {pokemon ? (
          <div className="text-center">
            <Image
              height={80}
              width={80}
              src={getPokemonImage(pokemon.id)}
              alt={pokemon.name}
            />
            <p className="text-lg font-semibold capitalize">{pokemon.name}</p>
            <p>HP: {pokemon.maxHp}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-lg font-semibold text-center">
            <Plus className="opacity-50" size={50} />
            <p>Add Pokemon</p>
          </div>
        )}
      </Link>
    </div>
  )
}

export default TeamSlot
