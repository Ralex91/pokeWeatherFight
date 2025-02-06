import type { Generated } from "kysely"

// Types des tables individuelles
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

// Type complet de la base de données pour Kysely
export interface Database {
  user: User
  account: Account
  session: Session
  verification: Verification
}
