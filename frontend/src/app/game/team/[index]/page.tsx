"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import { usePokemon, usePokemonTypes } from "@/features/pokemon/services"
import PokemonCard from "@/features/team/components/PokemonCard"
import { useUpdateTeam } from "@/features/team/services"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const Page = () => {
  const index = Number(useParams().index)
  const router = useRouter()
  const [type, setType] = useState<string | null>(null)
  const [search, setSearch] = useState<string | null>(null)

  const {
    data: pokemons,
    isLoading: isPokemonsLoading,
    isError: isPokemonsError,
  } = usePokemon(type, search)
  const {
    data: pokemonTypes,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
  } = usePokemonTypes()

  const queryClient = useQueryClient()
  const { mutateAsync } = useUpdateTeam(queryClient)

  const handleSelect = (pokemonId: number) => async () => {
    await mutateAsync({
      index,
      pokemonId,
    })
    toast.success("Pokemon added to team")
    router.push(`/game/team`)
  }

  return (
    <main className="flex-1 flex flex-col mb-3 relative">
      <div className="flex justify-between sticky top-0 py-3 bg-white shadow-md shadow-white">
        <h1 className="text-xl font-bold drop-shadow-md">Pokemons</h1>
        <div className="flex gap-2 items-stretch">
          <input
            className="bg-slate-200 px-4 py-2 rounded"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bg-slate-200 px-4 py-2 rounded capitalize"
            name="type"
            id="type"
            onChange={(e) => setType(e.target.value)}
          >
            {isLoadingTypes && <option>Loading...</option>}
            {isErrorTypes && <option>Error</option>}

            <option value="">All</option>
            {pokemonTypes?.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPokemonsLoading && <LoadingState />}
      {isPokemonsError && <ErrorState />}

      <div className="grid grid-cols-2 gap-2">
        {pokemons?.map((p) => (
          <PokemonCard onClick={handleSelect(p.id)} key={p.id} pokemon={p} />
        ))}
      </div>
    </main>
  )
}

export default Page
