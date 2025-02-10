import {
  acceptFriend,
  addFriend,
  deleteFriend,
  getUserFriend,
} from "@/services/friend.service.ts"
import { getUser } from "@/services/user.service.ts"
import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const friendController = new Hono<HonoContext>()

friendController.get("/", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ message: "Unauthorized" }, 401)
  }

  const friends = await getUserFriend(user.id)

  return c.json(friends)
})

friendController.post(
  "/",
  zValidator(
    "json",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const me = c.get("user")

    if (!me) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    const { userId } = c.req.valid("json")

    const friend = await getUser(userId)

    if (!friend) {
      return c.json({ message: "User not found" }, 404)
    }

    try {
      await addFriend(me.id, userId)
    } catch (e: any) {
      return c.json({ message: e.message }, 400)
    }

    return c.json({
      message: "Friend request sent",
    })
  }
)

friendController.patch(
  "/",
  zValidator(
    "json",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const me = c.get("user")

    if (!me) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    const { userId } = c.req.valid("json")
    const friend = await getUser(userId)

    if (!friend) {
      return c.json({ message: "User not found" }, 404)
    }

    try {
      await acceptFriend(me.id, userId)
    } catch (e: any) {
      return c.json({ message: e.message }, 400)
    }

    return c.json({
      message: "Friend accepted",
    })
  }
)

friendController.delete(
  "/",
  zValidator(
    "json",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const me = c.get("user")

    if (!me) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    const { userId } = c.req.valid("json")
    const friend = await getUser(userId)

    if (!friend) {
      return c.json({ message: "User not found" }, 404)
    }

    try {
      await deleteFriend(me.id, friend.id)
    } catch (e: any) {
      return c.json({ message: e.message }, 400)
    }

    return c.json({
      message: "Friend removed",
    })
  }
)

export default friendController
