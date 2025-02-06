import { initBattle, playTurn } from "@/services/battle.service.ts"
import { ActionType } from "@/types/battle.ts"
import { Hono } from "hono"

const battleController = new Hono()

battleController.get("/", async (c) => {
  return c.json(await initBattle())
})

battleController.get("/action", async (c) => {
  const state = await playTurn({ type: ActionType.ATTACK, value: 0 })
  return c.json(state)
})

export default battleController
