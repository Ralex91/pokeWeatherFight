"use client"

import MoveList from "@/components/battle/MoveList"
import PokemonList from "@/components/battle/PokemonList"
import { useBattleStore } from "@/stores/useBattleStore"
import { Swords, WalletCards } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
    <div className="flex-1 flex-col gap-5 flex my-4 relative">
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
            className="flex-1 bg-gradient-to-b from-[#f8819b] to-[#fd1952] hover:brightness-90 rounded-xl"
          >
            <div className="text-white text-3xl font-bold flex items-center justify-center gap-2">
              <Swords size={30} />
              Attack
            </div>
          </button>
          <button
            onClick={handleOpenMenu(2)}
            className="flex-1 bg-gradient-to-b from-[#81a7f8] to-[#1943fd] hover:brightness-90 rounded-xl"
          >
            <div className="text-white text-3xl font-bold flex items-center justify-center gap-2">
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

      <div className="flex justify-center items-center w-full h-full absolute -z-10">
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
