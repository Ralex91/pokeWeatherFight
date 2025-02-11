"use client"

import clsx from "clsx"
import { useRouter } from "next/navigation"
import { BATTLE_STATUS } from "./../constants"
import { BattleStuts } from "./../types"

type Props = {
  status: BattleStuts
}

const BattleRow = ({ status }: Props) => {
  const router = useRouter()
  const Icon = BATTLE_STATUS[status].icon

  const handleGoBattle = () => () => {
    if (status !== BattleStuts.IN_PROGRESS) {
      return
    }

    router.push(`/game/battle/tempID`)
  }

  return (
    <div
      onClick={handleGoBattle()}
      className="flex gap-2 p-2 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200"
    >
      <div
        className={clsx(
          BATTLE_STATUS[status].color,
          "flex justify-center items-center p-2 rounded-md"
        )}
      >
        <Icon size={30} className="opacity-50" />
      </div>
      <div className="w-full">
        <div className="flex w-full justify-between items-start">
          <p className="text-lg font-semibold text-gray-600">
            Player1 VS Player2
          </p>
          <p className="text-sm">#1234</p>
        </div>
        <p className="text-sm text-left">{BATTLE_STATUS[status].name}</p>
      </div>
    </div>
  )
}

export default BattleRow
