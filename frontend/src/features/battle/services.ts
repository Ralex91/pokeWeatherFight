import { client } from "@/utils/fetch"
import { createErrorHandler } from "@/utils/query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Action, Battle, BattleList } from "./types"

export const useBattle = (battleId: number) =>
  useQuery({
    queryKey: ["battle", battleId],
    queryFn: async () => await client.get<Battle>(`battle/${battleId}`).json(),
  })

export const useBattles = () =>
  useQuery({
    queryKey: ["battle"],
    queryFn: async () => await client.get<BattleList[]>("battle").json(),
  })

export const useCreateBattle = () =>
  useMutation({
    mutationFn: async (opponentId: string) =>
      await client
        .post<Battle>("battle", {
          json: {
            opponentId,
          },
        })
        .json(),
    onError: createErrorHandler,
  })

export const useAction = (battleId: number) =>
  useMutation({
    mutationFn: async ({ type, value }: Action) =>
      await client
        .post<Battle>(`battle/${battleId}/action`, { json: { type, value } })
        .json(),
    onError: createErrorHandler(),
  })
