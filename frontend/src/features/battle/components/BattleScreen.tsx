"use client"

import { useBattleStore } from "@/features/battle/stores/useBattleStore"
import { calculateHealth, getPokemonImage } from "@/features/pokemon/utils"
import clsx from "clsx"
import Image from "next/image"

const BattleScreen = () => {
  const { gameState, messageIndex } = useBattleStore()

  if (!gameState) {
    return null
  }

  const { player, opponent } = gameState
  const playerPokemon = player.pokemons[player.playedIndex]
  const opponentPokemon = opponent.pokemons[opponent.playedIndex]
  const isMessageDisplayed = messageIndex < gameState.messages.length

  return (
    <div className="relative flex max-h-[500px] flex-1 flex-col overflow-hidden rounded-b-lg bg-gradient-to-b from-[#818cf8] to-[#73ca7c]">
      <div className="flex w-full items-center justify-between px-10">
        <div className="w-52 rounded-lg bg-gray-200 px-4 py-2">
          <p className="text-lg font-semibold capitalize">
            {opponentPokemon.name}
          </p>
          <div className="ml-10 flex items-center gap-1 rounded-lg bg-gray-700 px-1">
            <p className="text-[10px] font-extrabold text-white">HP</p>
            <div
              className="h-2 w-full rounded-full bg-green-400 transition-all"
              style={{
                width: `${calculateHealth(
                  opponentPokemon.current_hp,
                  opponentPokemon.maxHp,
                )}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="relative scale-90">
          <Image
            className="relative z-10"
            src={getPokemonImage(opponentPokemon.pokemon_id)}
            alt="pokemon"
            width={200}
            height={200}
          />
          <div
            className="absolute right-0 top-20 w-full scale-150"
            style={{ perspective: "1000px" }}
          >
            <div
              style={{ transform: "rotateX(70deg)" }}
              className="aspect-square w-full rounded-full border-8 border-[#76658a] bg-[#89769e] shadow-2xl"
            ></div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-10">
        <div className="relative scale-110">
          <Image
            className="relative z-10"
            src={getPokemonImage(playerPokemon.pokemon_id)}
            alt="pokemon"
            width={200}
            height={200}
          />
          <div
            className="absolute right-0 top-20 w-full scale-150"
            style={{ perspective: "1000px" }}
          >
            <div
              style={{ transform: "rotateX(70deg)" }}
              className="aspect-square w-full rounded-full border-8 border-[#76658a] bg-[#89769e] shadow-2xl"
            ></div>
          </div>
        </div>
        <div className="w-52 rounded-lg bg-gray-200 px-4 py-2">
          <div className="flex w-full items-end justify-between">
            <p className="text-lg font-semibold capitalize">
              {playerPokemon.name}
            </p>
            <p className="text-sm font-semibold">
              {playerPokemon.current_hp} / {playerPokemon.maxHp}
            </p>
          </div>
          <div className="ml-10 flex items-center gap-1 rounded-lg bg-gray-700 px-1">
            <p className="text-[10px] font-extrabold text-white">HP</p>
            <div
              className="h-2 w-full rounded-full bg-green-400 transition-all"
              style={{
                width: `${calculateHealth(
                  playerPokemon.current_hp,
                  playerPokemon.maxHp,
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          { visible: isMessageDisplayed },
          "message absolute bottom-0 h-28 w-full rounded-t-lg border-t-2 border-gray-200/80 bg-gray-700/80 p-4 text-lg font-semibold text-white",
        )}
      >
        <p>{gameState.messages[messageIndex]}</p>
      </div>

      {!isMessageDisplayed && gameState.winner && (
        <div className="absolute flex h-full w-full items-center justify-center">
          <div className="w-full bg-gray-800/50 py-4">
            <p className="w-full bg-gradient-to-b from-yellow-300 to-amber-500 bg-clip-text text-center text-3xl font-extrabold uppercase text-transparent">
              {gameState.winner} win !
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BattleScreen
