import { getUser } from "@/features/user/repositories.ts"
import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { loggedCheck } from "../auth/middlewares.ts"
import { auth } from "../auth/services.ts"
import {
  acceptFriend,
  addFriend,
  deleteFriend,
  getFriendRequest,
  getUserFriend,
} from "./repositories.ts"

const router = new Hono<HonoContext>()

router.use("/*", loggedCheck)

router.get("/", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ message: "Unauthorized" }, 401)
  }

  const friends = await getUserFriend(user.id)

  return c.json(friends)
})

router.post(
  "/",
  zValidator(
    "json",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const me = c.get("user") as typeof auth.$Infer.Session.user
    const { userId } = c.req.valid("json")
    const friend = await getUser(userId)

    if (!friend) {
      return c.json({ error: "User not found" }, 404)
    }

    if (friend.id === me.id) {
      return c.json({ error: "You can't add yourself" }, 401)
    }

    await addFriend(me.id, userId)

    return c.json({
      message: "Friend request sent",
    })
  }
)

router.patch(
  "/",
  zValidator(
    "json",
    z.object({
      requestId: z.number(),
    })
  ),
  async (c) => {
    const me = c.get("user") as typeof auth.$Infer.Session.user
    const { requestId } = c.req.valid("json")
    const friendRequest = await getFriendRequest(requestId)

    if (!friendRequest) {
      return c.json({ message: "Friend request not found" }, 404)
    }

    if (friendRequest.friend_id !== me.id) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    await acceptFriend(requestId)

    return c.json({
      message: "Friend accepted",
    })
  }
)

router.delete(
  "/",
  zValidator(
    "json",
    z.object({
      requestId: z.number(),
    })
  ),
  async (c) => {
    const me = c.get("user") as typeof auth.$Infer.Session.user
    const { requestId } = c.req.valid("json")
    const friendRequest = await getFriendRequest(requestId)

    if (!friendRequest) {
      return c.json({ message: "Friend request not found" }, 404)
    }

    if (friendRequest.user_id !== me.id && friendRequest.friend_id !== me.id) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    await deleteFriend(requestId)

    return c.json({
      message: "Friend removed",
    })
  }
)

export default router
