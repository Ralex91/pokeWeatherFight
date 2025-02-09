"use client"

import { client } from "@/lib/fetch"
import { Pokemon } from "@/types/battle"
import { createErrorHandler } from "@/utils/query"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"

export const useTeam = () =>
  useQuery({
    queryKey: ["team"],
    queryFn: async () => await client.get<Pokemon[]>("team").json(),
  })

export const useUpdateTeam = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async ({
      index,
      pokemonId,
    }: {
      index: number
      pokemonId: number
    }) => {
      await client
        .patch("team", {
          json: { index, pokemonId },
        })
        .json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team"],
      })
    },
    onError: createErrorHandler(),
  })

export const useDeleteFromTeam = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (index: number) =>
      await client.delete("team", {
        json: { index },
      }),
    onSuccess: () => {
      console.log("Updated team")
      queryClient.invalidateQueries({
        queryKey: ["team"],
      })
    },
    onError: () => createErrorHandler(),
  })
