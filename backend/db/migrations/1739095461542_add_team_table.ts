import { Database } from "@/types/db.ts"
import { Kysely, sql } from "kysely"

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("team")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("user_id", "varchar(255)", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("pokemon_id", "integer", (col) =>
      col.references("pokemon.id").onDelete("cascade").notNull()
    )
    .addColumn("position", "integer", (col) =>
      col.notNull().check(sql`position >= 1 AND position <= 6`)
    )
    .addUniqueConstraint("unique_user_pokemon", ["user_id", "pokemon_id"])
    .addUniqueConstraint("unique_user_position", ["user_id", "position"])
    .execute()
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("team").execute()
}
