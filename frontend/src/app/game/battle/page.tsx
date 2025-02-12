"use client"

import BattleRow from "@/features/battle/components/BattleRow"
import { useBattles } from "@/features/battle/services"
import { Battle, BattleStuts } from "@/features/battle/types"
import { client } from "@/utils/fetch"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const Page = () => {
  const router = useRouter()
  const { data: battles } = useBattles()

  const handleCreateBattle = async () => {
    const res = await client.post("battle")

    if (res.ok) {
      const data: Battle = await res.json()

      router.push(`/game/battle/${data.id}`)
    } else {
      console.error(await res.text())
    }
  }

  return (
    <main className="flex-1 flex flex-col my-3 gap-3 relative">
      <div className="flex-1 divide-y-2 divide-gray-200">
        <div>
          <h2 className="text-xl drop-shadow-md font-bold">Active Battle</h2>
          <div className="flex flex-col items-stretch gap-2 my-3">
            {battles
              ?.filter((battle) => battle.status === BattleStuts.IN_PROGRESS)
              .map((battle) => <BattleRow battle={battle} key={battle.id} />)}
          </div>
        </div>
        <div>
          <h2 className="text-xl drop-shadow-md font-bold">Battle Hisory</h2>
          <div className="flex flex-col items-stretch gap-2 my-3">
            {battles
              ?.filter((battle) => !!battle.winner)
              .map((battle) => <BattleRow battle={battle} key={battle.id} />)}
          </div>
        </div>
      </div>
      <div className="sticky bottom-16 ml-auto mr-2">
        <button
          className="bg-gradient-to-b from-blue-500 to-blue-700 hover:brightness-90 p-2 aspect-square shadow-md rounded-full"
          onClick={handleCreateBattle}
        >
          <div className="text-white text-lg font-bold flex items-center justify-center gap-2 w-10">
            <Plus size={30} />
          </div>
        </button>
      </div>
    </main>
  )
}

export default Page
