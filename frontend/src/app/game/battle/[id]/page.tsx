"use client"

import BattleScreen from "@/components/battle/BattleScreen"
import BottomScreen from "@/components/battle/BottomScreen"
import { useBattleStore } from "@/stores/useBattleStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const { gameState } = useBattleStore()
  const router = useRouter()

  useEffect(() => {
    if (!gameState) {
      router.push("/game/battle")
    }
  }, [gameState, router])

  return (
    <main className="flex-1 flex flex-col">
      <BattleScreen />
      <BottomScreen />
    </main>
  )
}

export default Page
