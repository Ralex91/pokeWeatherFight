"use client"

import clsx from "clsx"
import { useRouter } from "next/navigation"
import { BATTLE_STATUS } from "./../constants"
import { BattleList, BattleStuts } from "./../types"

type Props = {
  battle: BattleList
}

const BattleRow = ({ battle }: Props) => {
  const router = useRouter()
  const Icon = BATTLE_STATUS[battle.status].icon

  const isBattleInProgress = battle.status === BattleStuts.IN_PROGRESS

  const handleGoBattle = () => () => {
    if (!isBattleInProgress) {
      return
    }

    router.push(`/game/battle/${battle.id}`)
  }

  return (
    <div
      onClick={handleGoBattle()}
      className={clsx(
        "flex gap-2 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 p-2",
        {
          "cursor-pointer": isBattleInProgress,
        },
      )}
    >
      <div
        className={clsx(
          BATTLE_STATUS[battle.status].color,
          "flex items-center justify-center rounded-md p-2",
        )}
      >
        <Icon size={30} className="opacity-50" />
      </div>
      <div className="w-full">
        <div className="flex w-full items-start justify-between">
          <p className="text-lg font-semibold text-gray-600">
            {battle.player} VS {battle.opponent}
          </p>
          <p className="text-sm">#{battle.id}</p>
        </div>
        <p className="text-left text-sm">{BATTLE_STATUS[battle.status].name}</p>
      </div>
    </div>
  )
}

export default BattleRow
