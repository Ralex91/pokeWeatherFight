import { initBattle, playTurn } from "@/services/battle.service.ts"
import { ActionType } from "@/types/battle.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const battleController = new Hono()

battleController.post("/", async (c) => {
  return c.json(await initBattle())
})

battleController.post(
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

export default battleController
