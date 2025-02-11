import { db } from "@/lib/db.ts"

export const getUser = async (userId: string) => {
  const user = await db
    .selectFrom("user")
    .where("id", "=", userId)
    .selectAll()
    .executeTakeFirst()

  return user
}
