"use client"

import { client } from "@/lib/fetch"
import { useBattleStore } from "@/stores/useBattleStore"
import { Battle, Pokemon } from "@/types/battle"
import clsx from "clsx"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

type Prop = {
  pokemons: Pokemon[]
  playedIndex: number
}

const PokemonList = ({ pokemons, playedIndex }: Prop) => {
  const { setGameState, setMenuOpenIndex } = useBattleStore()

  const handleSwitch = (pokemonIndex: number) => async () => {
    const res = await client.post("battle/action", {
      json: { action: "switch", value: pokemonIndex },
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
      <div className="grid grid-cols-2 gap-2">
        {pokemons.map((p, i) => (
          <button
            key={i}
            onClick={handleSwitch(i)}
            className={clsx(
              {
                "pointer-events-none brightness-75": p.hp <= 0,
              },
              {
                "pointer-events-none animate-pulse":
                  p.id === pokemons[playedIndex].id,
              },
              "flex items-center rounded-lg flex-1 px-4 py-2 bg-gradient-to-b from-gray-100 to-gray-200"
            )}
          >
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${p.id}.png`}
              alt={p.name}
              width={100}
              height={100}
              className="w-20 h-20"
            ></Image>
            <div>
              <p className="capitalize font-semibold">{p.name}</p>
              <p>
                {p.hp} / {p.maxHp}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PokemonList
