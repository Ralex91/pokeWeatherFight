"use client"

import { useBattleStore } from "@/features/battle/stores/useBattleStore"
import { Swords, WalletCards } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import MoveList from "./MoveList"
import PokemonList from "./PokemonList"

const BottomScreen = () => {
  const {
    gameState,
    menuOpenIndex,
    messageIndex,
    setMenuOpenIndex,
    setMessageIndex,
  } = useBattleStore()
  const router = useRouter()

  if (!gameState) {
    return null
  }

  const player = gameState.player
  const isMessageDisplayed = messageIndex < gameState.messages.length
  const isPaused = isMessageDisplayed || gameState.winner

  const handleOpenMenu = (index: number) => () => setMenuOpenIndex(index)
  const handleNextMessage = () => {
    if (messageIndex < gameState.messages.length) {
      setMessageIndex(messageIndex + 1)
    }
  }
  const handleExit = () => router.push("/game/battle")

  return (
    <div className="relative my-4 flex flex-1 flex-col gap-5">
      {isMessageDisplayed && (
        <button onClick={handleNextMessage} className="flex-1">
          <p className="text-3xl font-bold text-gray-700/60">Tap to continue</p>
        </button>
      )}

      {!isMessageDisplayed && gameState.winner && (
        <button onClick={handleExit} className="flex-1">
          <p className="text-3xl font-bold text-gray-700/60">Exit the battle</p>
        </button>
      )}

      {!isPaused && menuOpenIndex === 0 && (
        <>
          <button
            onClick={handleOpenMenu(1)}
            className="flex-1 rounded-xl bg-gradient-to-b from-[#f8819b] to-[#fd1952] hover:brightness-90"
          >
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
              <Swords size={30} />
              Attack
            </div>
          </button>
          <button
            onClick={handleOpenMenu(2)}
            className="flex-1 rounded-xl bg-gradient-to-b from-[#81a7f8] to-[#1943fd] hover:brightness-90"
          >
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
              <WalletCards size={30} />
              Pokemon
            </div>
          </button>
        </>
      )}

      {menuOpenIndex === 1 && (
        <MoveList moves={player.pokemons[player.playedIndex].moves} />
      )}

      {menuOpenIndex === 2 && (
        <PokemonList
          pokemons={player.pokemons}
          playedIndex={player.playedIndex}
        />
      )}

      <div className="absolute -z-10 flex h-full w-full items-center justify-center">
        <Image
          className="opacity-20"
          src="/pokeball.svg"
          alt="battle"
          width={300}
          height={300}
        />
      </div>
    </div>
  )
}

export default BottomScreen
