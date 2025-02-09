import { Database } from "@/types/db.ts"
import { Kysely } from "kysely"

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("pokemon")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("maxHp", "integer", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("type")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("name", "varchar(50)", (col) => col.notNull().unique())
    .execute()

  await db.schema
    .createTable("pokemon_type")
    .addColumn("pokemon_id", "integer", (col) =>
      col.references("pokemon.id").onDelete("cascade").notNull()
    )
    .addColumn("type_id", "integer", (col) =>
      col.references("type.id").onDelete("cascade").notNull()
    )
    .execute()

  await db.schema
    .createTable("move")
    .addColumn("id", "integer", (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("power", "integer")
    .addColumn("type_id", "integer", (col) =>
      col.references("type.id").onDelete("cascade").notNull()
    )
    .execute()

  await db.schema
    .createTable("pokemon_move")
    .addColumn("pokemon_id", "integer", (col) =>
      col.references("pokemon.id").onDelete("cascade").notNull()
    )
    .addColumn("move_id", "integer", (col) =>
      col.references("move.id").onDelete("cascade").notNull()
    )
    .execute()
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("pokemon_move").execute()
  await db.schema.dropTable("move").execute()
  await db.schema.dropTable("pokemon_type").execute()
  await db.schema.dropTable("type").execute()
  await db.schema.dropTable("pokemon").execute()
}
