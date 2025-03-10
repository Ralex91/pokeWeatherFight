import { defineConfig } from "kysely-ctl"
import { dialect } from "./src/lib/db.ts"

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "./db/migrations",
  },
  seeds: {
    seedFolder: "./db/seeds",
  },
})
