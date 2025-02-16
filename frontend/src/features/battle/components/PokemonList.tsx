"use client"

import { useBattleStore } from "@/features/battle/stores/useBattleStore"
import clsx from "clsx"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { useAction } from "../services"
import { ActionType, PokemonInBattle } from "./../types"

type Prop = {
  pokemons: PokemonInBattle[]
  playedIndex: number
}

const PokemonList = ({ pokemons, playedIndex }: Prop) => {
  const { gameState, setGameState, setMenuOpenIndex } = useBattleStore()

  if (!gameState) {
    return null
  }

  const { mutate, data: newBattleData } = useAction(gameState.id)

  const handleSwitch = (pokemonIndex: number) => () =>
    mutate({
      type: ActionType.SWITCH,
      value: pokemonIndex,
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
      <div className="grid grid-cols-2 gap-2">
        {pokemons.map((p, i) => (
          <button
            key={i}
            onClick={handleSwitch(i)}
            className={clsx(
              {
                "pointer-events-none brightness-75": p.current_hp <= 0,
              },
              {
                "pointer-events-none animate-pulse":
                  p.id === pokemons[playedIndex].id,
              },
              "flex flex-1 items-center rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 px-4 py-2",
            )}
          >
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${p.pokemon_id}.png`}
              alt={p.name}
              width={100}
              height={100}
              className="h-20 w-20"
            ></Image>
            <div>
              <p className="font-semibold capitalize">{p.name}</p>
              <p>
                {p.current_hp} / {p.maxHp}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PokemonList
