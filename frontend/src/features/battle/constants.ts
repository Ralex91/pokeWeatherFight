import { Play, Trophy, X } from "lucide-react"
import { BattleStuts } from "./types"

export const BATTLE_STATUS = {
  [BattleStuts.IN_PROGRESS]: {
    name: "In progress",
    icon: Play,
    color: "bg-gray-300",
  },
  [BattleStuts.WIN]: {
    name: "Win",
    icon: Trophy,
    color: "bg-amber-300",
  },
  [BattleStuts.LOSE]: {
    name: "Lose",
    icon: X,
    color: "bg-red-300",
  },
}
