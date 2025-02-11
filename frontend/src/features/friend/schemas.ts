import { z } from "zod"

export const addFriendSchema = z.object({
  userId: z.string().min(1, { message: "User id is required" }),
})
