"use client"

import { useBattleStore } from "@/features/battle/stores/useBattleStore"
import { Move } from "@/features/pokemon/types"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { useAction } from "../services"
import { ActionType } from "./../types"

type Prop = {
  moves: Move[]
}

const MoveList = ({ moves = [] }: Prop) => {
  const { gameState, setGameState, setMenuOpenIndex } = useBattleStore()

  if (!gameState) {
    return null
  }

  const { mutate, data: newBattleData } = useAction(gameState.id)

  const handleAttack = (attackIndex: number) => () =>
    mutate({
      type: ActionType.ATTACK,
      value: attackIndex,
    })

  const handeBack = () => setMenuOpenIndex(0)

  useEffect(() => {
    if (newBattleData) {
      setGameState(newBattleData)
    }
  }, [newBattleData])

  return (
    <div>
      <button
        className="flex items-center gap-2 rounded-lg px-4 py-2 hover:brightness-90"
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
              className="flex flex-1 items-center justify-between rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 px-4 py-2"
            >
              <p className="font-semibold capitalize">{m.name}</p>
              <p>{m.power}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoveList
