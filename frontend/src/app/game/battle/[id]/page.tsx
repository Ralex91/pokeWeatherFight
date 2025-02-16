"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import BattleScreen from "@/features/battle/components/BattleScreen"
import BottomScreen from "@/features/battle/components/BottomScreen"
import { useBattle } from "@/features/battle/services"
import { useBattleStore } from "@/features/battle/stores/useBattleStore"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const router = useRouter()
  const battleId = Number(useParams().id)
  const { data: battle, isLoading, isSuccess, isError } = useBattle(battleId)
  const { setGameState } = useBattleStore()

  useEffect(() => {
    if (isError) {
      router.push("/game/battle")
    }

    if (isLoading || !isSuccess) {
      return
    }

    setGameState(battle)
  }, [isLoading, isSuccess, battle, setGameState, router, isError])

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <main className="flex-1 flex flex-col">
      <BattleScreen />
      <BottomScreen />
    </main>
  )
}

export default Page
