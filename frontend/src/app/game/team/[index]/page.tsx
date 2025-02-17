"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import { usePokemon, usePokemonTypes } from "@/features/pokemon/services"
import PokemonCard from "@/features/team/components/PokemonCard"
import { useUpdateTeam } from "@/features/team/services"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"
import { useDebounceCallback } from 'usehooks-ts'

const Page = () => {
  const index = Number(useParams().index)
  const router = useRouter()
  const [type, setType] = useState<string | null>(null)
  const [search, setSearch] = useState<string | null>(null)
  const debounced = useDebounceCallback(setSearch, 300)

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
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => debounced(e.target.value)
  const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value)

  return (
    <main className="relative mb-3 flex flex-1 flex-col">
      <div className="sticky top-0 flex justify-between bg-white py-3 shadow-md shadow-white">
        <h1 className="text-xl font-bold drop-shadow-md">Pokemons</h1>
        <div className="flex items-stretch gap-2">
          <input
            className="rounded bg-slate-200 px-4 py-2"
            type="text"
            placeholder="Search"
            onChange={handleSearch}
          />
          <select
            className="rounded bg-slate-200 px-4 py-2 capitalize"
            name="type"
            id="type"
            onChange={handleChangeType}
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
