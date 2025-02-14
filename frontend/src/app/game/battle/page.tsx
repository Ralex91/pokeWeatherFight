"use client"

import BattleRow from "@/features/battle/components/BattleRow"
import { useBattles } from "@/features/battle/services"
import { BattleStuts } from "@/features/battle/types"
import { Plus } from "lucide-react"
import Link from "next/link"

const Page = () => {
  const { data: battles } = useBattles()

  const activeBattles = battles?.filter(
    (battle) => battle.status === BattleStuts.IN_PROGRESS
  )
  const finishedBattles = battles?.filter((battle) => !!battle.winner)
  return (
    <main className="flex-1 flex flex-col my-3 gap-3 relative">
      <div className="flex-1 divide-y-2 divide-gray-200">
        <div>
          <h2 className="text-xl drop-shadow-md font-bold">Active Battle</h2>
          <div className="flex flex-col items-stretch gap-2 my-3">
            {activeBattles?.length === 0 && (
              <p className="text-center">No active battle</p>
            )}
            {activeBattles?.map((battle) => (
              <BattleRow battle={battle} key={battle.id} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl drop-shadow-md font-bold">Battle Hisory</h2>
          <div className="flex flex-col items-stretch gap-2 my-3">
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
          className="flex bg-gradient-to-b cursor-pointer from-blue-500 to-blue-700 hover:brightness-90 p-2 aspect-square shadow-md rounded-full"
        >
          <div className="text-white text-lg font-bold flex items-center justify-center gap-2 w-10">
            <Plus size={30} />
          </div>
        </Link>
      </div>
    </main>
  )
}

export default Page
