import { create } from "zustand"
import { Battle } from "../types/battle"

type GameStateStore = {
  gameState: Battle | null
  messageIndex: number
  menuOpenIndex: number
  setGameState: (gameState: Battle) => void
  setMessageIndex: (index: number) => void
  setMenuOpenIndex: (index: number) => void
}

type BattleStore = GameStateStore
export const useBattleStore = create<BattleStore>((set) => ({
  gameState: null,
  messageIndex: 0,
  menuOpenIndex: 0,
  setGameState: (gameState) =>
    set({ gameState, messageIndex: 0, menuOpenIndex: 0 }),
  setMessageIndex: (index) => set({ messageIndex: index }),
  setMenuOpenIndex: (index) => set({ menuOpenIndex: index }),
}))
