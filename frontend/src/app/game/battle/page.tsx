"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import BattleRow from "@/features/battle/components/BattleRow"
import { useBattles } from "@/features/battle/services"
import { BattleStuts } from "@/features/battle/types"
import { Plus } from "lucide-react"
import Link from "next/link"

const Page = () => {
  const { data: battles, isLoading, isError } = useBattles()

  const activeBattles = battles?.filter(
    (battle) => battle.status === BattleStuts.IN_PROGRESS,
  )
  const finishedBattles = battles?.filter((battle) => !!battle.winner)

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <main className="relative my-3 flex flex-1 flex-col gap-3">
      <div className="flex-1 divide-y-2 divide-gray-200">
        <div>
          <h2 className="text-xl font-bold drop-shadow-md">Active Battle</h2>
          <div className="my-3 flex flex-col items-stretch gap-2">
            {activeBattles?.length === 0 && (
              <p className="text-center">No active battle</p>
            )}
            {activeBattles?.map((battle) => (
              <BattleRow battle={battle} key={battle.id} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold drop-shadow-md">Battle Hisory</h2>
          <div className="my-3 flex flex-col items-stretch gap-2">
            {finishedBattles?.length === 0 && (
              <p className="text-center">No battle history</p>
            )}
            {finishedBattles?.map((battle) => (
              <BattleRow battle={battle} key={battle.id} />
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-16 ml-auto mr-2">
        <Link
          href="/game/battle/create"
          className="flex aspect-square cursor-pointer rounded-full bg-gradient-to-b from-blue-500 to-blue-700 p-2 shadow-md hover:brightness-90"
        >
          <div className="flex w-10 items-center justify-center gap-2 text-lg font-bold text-white">
            <Plus size={30} />
          </div>
        </Link>
      </div>
    </main>
  )
}

export default Page
