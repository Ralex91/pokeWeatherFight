import { Battle, PlayerType, WeatherAttackMap } from "@/types/battle.ts"

export const TEAM_SIZE = 6

export const GAME_INIT_STATE: Battle = {
  turn: PlayerType.PLAYER,
  winner: null,
  player: {
    name: "Player",
    playedIndex: 0,
    pokemons: [],
  },
  opponent: {
    name: "Opponent",
    playedIndex: 0,
    pokemons: [],
  },
  messages: [],
}

export const WEATHER_ATTACK_MAP: WeatherAttackMap[] = [
  {
    name: "rain",
    codes: [61, 63, 65, 80, 81, 82],
    effects: { fire: -10, water: +10 },
  },
  { name: "sun", codes: [0, 1], effects: { fire: +10, ice: -10 } },
  {
    name: "snow",
    codes: [71, 73, 75, 85, 86],
    effects: { ice: +10, grass: -10 },
  },
]
