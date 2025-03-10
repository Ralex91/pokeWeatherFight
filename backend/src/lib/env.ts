import "dotenv/config"
import { z } from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string().transform(Number),
  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
})

export type envType = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error("❌ Invalid environment variables:")
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
