import { client } from "@/lib/fetch"
import { Friend, Friends } from "@/types/friend"
import { createErrorHandler } from "@/utils/query"
import { useMutation, useQuery } from "@tanstack/react-query"

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

export const useAddFriend = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      await client.post("friend", { json: { userId } }).json(),
    onError: createErrorHandler(),
  })

export const useAcceptFriend = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      await client.patch("friend", { json: { userId } }).json(),
    onError: createErrorHandler(),
  })

export const useDeleteFriend = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      await client.delete("friend", { json: { userId } }).json(),
    onError: createErrorHandler(),
  })
