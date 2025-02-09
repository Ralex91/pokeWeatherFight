import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("battle")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("player1_id", "varchar", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("player2_id", "varchar", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("status", "varchar", (col) => col.notNull().defaultTo("pending"))
    .addColumn("winner_id", "varchar", (col) =>
      col.references("user.id").onDelete("set null")
    )
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  await db.schema
    .createTable("battle_pokemon")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("battle_id", "integer", (col) =>
      col.references("battle.id").onDelete("cascade").notNull()
    )
    .addColumn("pokemon_id", "integer", (col) =>
      col.references("pokemon.id").onDelete("cascade").notNull()
    )
    .addColumn("user_id", "varchar", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("current_hp", "integer", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .addColumn("is_active", "boolean", (col) => col.notNull().defaultTo(false))
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("battle_pokemon").execute()
  await db.schema.dropTable("battle").execute()
}
