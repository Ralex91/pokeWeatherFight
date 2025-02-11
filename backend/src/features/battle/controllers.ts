import { createBattle } from "@/features/battle/repositories.ts"
import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { playTurn } from "./services.ts"
import { ActionType } from "./types.ts"

const router = new Hono<HonoContext>()

router.post(
  "/",
  zValidator(
    "json",
    z.object({
      opponentId: z.string(),
    })
  ),
  async (c) => {
    const user = c.get("user")

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401)
    }

    const { opponentId } = c.req.valid("json")

    return c.json(await createBattle(user.id, opponentId))
  }
)

router.post(
  "/action",
  zValidator(
    "json",
    z.object({
      action: z.enum([ActionType.ATTACK, ActionType.SWITCH]),
      value: z.number(),
    })
  ),
  async (c) => {
    const { action, value } = c.req.valid("json")

    const state = await playTurn({ type: action, value: value })
    return c.json(state)
  }
)

export default router
