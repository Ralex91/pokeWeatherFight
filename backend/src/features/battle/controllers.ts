import { createBattle, getBattle } from "@/features/battle/repositories.ts"
import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { playTurn } from "./services.ts"
import { ActionType } from "./types.ts"

const router = new Hono<HonoContext>()

router.get("/:battleId", async (c) => {
  const { battleId } = c.req.param()

  return c.json(await getBattle(Number(battleId)))
})

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
    const newBattleId = await createBattle(user.id, opponentId)

    return c.json({
      id: newBattleId,
    })
  }
)

router.post(
  "/:battleId/action",
  zValidator(
    "json",
    z.object({
      type: z.nativeEnum(ActionType),
      value: z.number(),
    })
  ),
  async (c) => {
    const { battleId } = c.req.param()
    const { type, value } = c.req.valid("json")

    const battle = await getBattle(Number(battleId))

    if (!battle) {
      return c.json({ message: "Battle not found" }, 404)
    }

    const newState = await playTurn(battle, {
      type,
      value,
    })

    return c.json(newState)
  }
)

export default router
