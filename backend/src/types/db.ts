import type { Generated } from "kysely"

export interface User {
  id: Generated<string>
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: Generated<string>
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Date | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: Generated<string>
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

export interface Verification {
  id: Generated<string>
  identifier: string
  value: string
  expiresAt: Date
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Pokemon {
  id: number
  name: string
  maxHp: number
}

export interface Type {
  id: Generated<number>
  name: string
}

export interface Pokemon_type {
  pokemon_id: number
  type_id: number
}

export interface Move {
  id: Generated<number>
  name: string
  power: number
  type_id: number
}

export interface Pokemon_move {
  pokemon_id: number
  move_id: number
}

export interface Team {
  id: Generated<number>
  user_id: string
  pokemon_id: number
  position: number
}

export enum BattleStatus {
  PENDING = "pending",
  ACTIVE = "active",
  FINISHED = "finished",
}

export interface Battle {
  id: Generated<number>
  player1_id: string
  player2_id: string
  status: BattleStatus
  winner_id: string | null
  createdAt: Generated<Date>
}

export interface Battle_pokemon {
  id: Generated<number>
  battle_id: number
  pokemon_id: number
  user_id: string
  current_hp: number
}

export interface Database {
  user: User
  account: Account
  session: Session
  verification: Verification
  pokemon: Pokemon
  type: Type
  pokemon_type: Pokemon_type
  move: Move
  pokemon_move: Pokemon_move
  team: Team
  battle: Battle
  battle_pokemon: Battle_pokemon
}
