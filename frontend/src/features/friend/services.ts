import { client } from "@/utils/fetch"
import { createErrorHandler } from "@/utils/query"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { Friend, Friends } from "./types"

export const useFriend = () =>
  useQuery<Friends>({
    queryKey: ["friend"],
    queryFn: async () => {
      const data = await client.get<Friend[]>("friend").json()

      const friends = data.filter((friend: Friend) => friend.accepted)
      const requests = data.filter((friend: Friend) => !friend.accepted)

      return { friends, requests }
    },
  })

export const useAddFriend = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (userId: string) =>
      await client.post("friend", { json: { userId } }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["friend"],
      }),
    onError: createErrorHandler(),
  })

export const useAcceptFriend = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (requestId: number) =>
      await client.patch("friend", { json: { requestId } }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["friend"],
      }),
    onError: createErrorHandler(),
  })

export const useDeleteFriend = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (requestId: number) =>
      await client.delete("friend", { json: { requestId } }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["friend"],
      }),
    onError: createErrorHandler(),
  })
