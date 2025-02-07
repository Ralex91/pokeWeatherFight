"use client"

import { client } from "@/lib/fetch"
import { useBattleStore } from "@/stores/useBattleStore"
import { ActionType, Battle, Move } from "@/types/battle"
import { ArrowLeft } from "lucide-react"

type Prop = {
  moves: Move[]
}

const MoveList = ({ moves = [] }: Prop) => {
  const { setGameState, setMenuOpenIndex } = useBattleStore()

  const handleAttack = (attackIndex: number) => async () => {
    const res = await client.post("battle/action", {
      json: { action: ActionType.ATTACK, value: attackIndex },
    })

    if (res.ok) {
      const data: Battle = await res.json()
      setGameState(data)
    } else {
      console.error(await res.text())
    }
  }
  const handeBack = () => setMenuOpenIndex(0)

  return (
    <div>
      <button
        className="flex gap-2 items-center px-4 py-2 hover:brightness-90 rounded-lg"
        onClick={handeBack}
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="flex flex-col gap-2">
        {moves.map((m, i) => (
          <div key={i} className="flex gap-2">
            <button
              onClick={handleAttack(i)}
              className="flex justify-between items-center rounded-lg flex-1 px-4 py-2 bg-gradient-to-b from-gray-100 to-gray-200"
            >
              <p className="capitalize font-semibold">{m.name}</p>
              <p>{m.power}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoveList
