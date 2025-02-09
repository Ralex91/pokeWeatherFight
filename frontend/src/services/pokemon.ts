import { client } from "@/lib/fetch"
import { Pokemon } from "@/types/battle"
import { useQuery } from "@tanstack/react-query"

export const usePokemon = (type: string | null, search: string | null) =>
  useQuery<Pokemon[]>({
    queryKey: ["pokemons", type, search],
    queryFn: async () =>
      await client
        .get("pokemon", {
          searchParams: {
            ...(type && { type }),
            ...(search && { search }),
          },
        })
        .json(),
  })

export const usePokemonTypes = () =>
  useQuery({
    queryKey: ["pokemon-types"],
    queryFn: async () => await client.get<string[]>("pokemon/types").json(),
  })
