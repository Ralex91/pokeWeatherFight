import { WeatherAttackMap } from "./types.ts"

export const TEAM_SIZE = 6

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