import { z } from "zod"
import { addFriendSchema } from "./schemas"

export type Friend = {
  id: number
  friend_id: string
  friend_name: string
  requester_id: string
  accepted: boolean
}

export type Friends = {
  friends: Friend[]
  requests: Friend[]
}

export type addFriendSchemaType = z.infer<typeof addFriendSchema>
