# PokeWeatherFight ⛅💥

PokeWeatherFight is a web application that allows you to play a game of Pokémon where you battle other players based on weather in ghost mode.

## 📋 Requirement

- Node.js 20+
- PostgreSQL
- Docker
- PNPM

## 🚀 Getting Started

- Clone the repository

  ```bash
  git clone https://github.com/Ralex91/pokeWeatherFight.git
  cd poke-weather-fight
  ```

- Install dependencies

  ```bash
  pnpm install
  ```

- Configure environment variables in `backend/.env` and `frontend/.env`

  ```bash
  cp backend/.env.example backend/.env
  cp frontend/.env.example frontend/.env
  ```

- Run docker compose

  ```bash
  pnpm docker:up
  ```

- Run database migrations

  ```bash
  pnpm db:migrate
  ```

- Run database seeds

  ```bash
  pnpm db:seed
  ```

- Run dev server

  ```bash
  pnpm dev
  ```
