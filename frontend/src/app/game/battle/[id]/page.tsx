"use client"

import BattleScreen from "@/features/battle/components/BattleScreen"
import BottomScreen from "@/features/battle/components/BottomScreen"
import { useBattleStore } from "@/features/battle/stores/useBattleStore"
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
