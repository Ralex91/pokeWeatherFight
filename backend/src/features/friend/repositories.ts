import { db } from "@/lib/db.ts"

export const getFriendRequest = async (requestId: number) => {
  const result = await db
    .selectFrom("friend")
    .select([
      "friend.id",
      "friend.user_id",
      "friend.friend_id",
      "friend.accepted",
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "friend.user_id")
          .select(["user.name"])
          .as("user_name"),
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "friend.friend_id")
          .select(["user.name"])
          .as("friend_name"),
    ])
    .where("friend.id", "=", requestId)
    .executeTakeFirst()

  return result
}

export const getUserFriend = async (userId: string) => {
  const result = await db
    .selectFrom("friend")
    .select([
      "friend.id",
      "friend.user_id",
      "friend.friend_id",
      "friend.accepted",
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "friend.user_id")
          .select(["user.name"])
          .as("user_name"),
      (eb) =>
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "friend.friend_id")
          .select(["user.name"])
          .as("friend_name"),
    ])
    .where((eb) =>
      eb.or([eb("user_id", "=", userId), eb("friend_id", "=", userId)])
    )
    .execute()

  return result.map((row) => {
    const friendId = row.user_id === userId ? row.friend_id : row.user_id
    const friendName = row.user_id === userId ? row.friend_name : row.user_name

    return {
      id: row.id,
      friend_id: friendId,
      friend_name: friendName,
      requester_id: row.user_id,
      accepted: row.accepted,
    }
  })
}

export const addFriend = async (userId: string, friendId: string) => {
  const isAlreadySendRequest = await db
    .selectFrom("friend")
    .where((eb) =>
      eb.or([
        eb.and([eb("user_id", "=", userId), eb("friend_id", "=", friendId)]),
        eb.and([eb("user_id", "=", friendId), eb("friend_id", "=", userId)]),
      ])
    )
    .select("accepted")
    .executeTakeFirst()

  if (isAlreadySendRequest) {
    throw new Error(
      isAlreadySendRequest.accepted ? "Already friend" : "Already send request"
    )
  }

  await db
    .insertInto("friend")
    .values({
      user_id: userId,
      friend_id: friendId,
      accepted: false,
    })
    .execute()
}

export const acceptFriend = async (requestId: number) =>
  await db
    .updateTable("friend")
    .set({ accepted: true })
    .where("id", "=", requestId)
    .execute()

export const deleteFriend = async (requestId: number) =>
  await db.deleteFrom("friend").where("id", "=", requestId).execute()
