import { WeatherApiResponse } from "@/types/weather.ts"
import ky from "ky"

export const getWeatherCode = async () => {
  const coordsOfParis = { lat: 48.8566, lon: 2.3522 }
  const { lat, lon } = coordsOfParis

  const res: WeatherApiResponse = await ky
    .get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
    .json()

  return res.current_weather.weathercode
}
