import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("friend")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("friend_id", "text", (col) => col.notNull())
    .addColumn("accepted", "boolean", (col) => col.notNull().defaultTo(false))
    .addForeignKeyConstraint("friend_user_id", ["user_id"], "user", ["id"])
    .addForeignKeyConstraint("friend_friend_id", ["friend_id"], "user", ["id"])
    .addUniqueConstraint("friend_user_id_friend_id", ["user_id", "friend_id"])
    .addCheckConstraint(
      "friend_user_id_friend_id_check",
      sql`user_id <> friend_id`
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("friend").execute()
}
