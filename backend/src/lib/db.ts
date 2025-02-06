import type { Database } from "@/types/db.ts"
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely"
import pg from "pg"
import env from "./env.ts"
const { Pool } = pg

export const dialect = new PostgresDialect({
  pool: new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: Number(env.DB_PORT),
  }),
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
})
