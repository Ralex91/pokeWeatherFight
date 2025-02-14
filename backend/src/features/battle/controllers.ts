import {
  createBattle,
  getBattle,
  getUserBattles,
} from "@/features/battle/repositories.ts"
import { HonoContext } from "@/types/hono.ts"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { loggedCheck } from "../auth/middlewares.ts"
import { auth } from "../auth/services.ts"
import { playTurn } from "./services.ts"
import { ActionType } from "./types.ts"

const router = new Hono<HonoContext>()

router.use("/*", loggedCheck)

router.get("/", async (c) => {
  const user = c.get("user") as typeof auth.$Infer.Session.user

  return c.json(await getUserBattles(user.id))
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
    const user = c.get("user") as typeof auth.$Infer.Session.user
    const { opponentId } = c.req.valid("json")
    const newBattleId = await createBattle(user.id, opponentId)

    return c.json({
      id: newBattleId,
    })
  }
)

router.get("/:battleId", async (c) => {
  const { battleId } = c.req.param()

  if (!Number(battleId)) {
    return c.json({ message: "Invalid battle id" }, 400)
  }

  const battle = await getBattle(Number(battleId))

  if (!battle) {
    return c.json({ message: "Battle not found" }, 404)
  }

  if (battle.player.id !== c.get("user")?.id) {
    return c.json({ message: "Unauthorized" }, 401)
  }

  return c.json(battle)
})

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
    const user = c.get("user") as typeof auth.$Infer.Session.user
    const { battleId } = c.req.param()
    const { type, value } = c.req.valid("json")
    const battle = await getBattle(Number(battleId))

    if (!battle) {
      return c.json({ message: "Battle not found" }, 404)
    }

    if (battle.player.id !== user.id) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const newState = await playTurn(battle, {
      type,
      value,
    })

    return c.json(newState)
  }
)

export default router
