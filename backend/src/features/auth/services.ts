import { dialect } from "@/lib/db.ts"
import env from "@/lib/env.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: {
    dialect,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
})
