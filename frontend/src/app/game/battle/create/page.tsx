"use client"

import { useCreateBattle } from "@/features/battle/services"
import { useFriend } from "@/features/friend/services"
import { Friend } from "@/features/friend/types"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const Page = () => {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const { data, isLoading } = useFriend()
  const { mutateAsync } = useCreateBattle()

  const handleSelect = (friendId: string) => () => setSelected(friendId)

  const handleCreateBattle = async () => {
    if (!selected) {
      return
    }

    const { id } = await mutateAsync(selected)
    toast.success("Battle created")
    router.push(`/game/battle/${id}`)
  }

  return (
    <main className="flex-1 flex flex-col my-3 relative">
      <div className="flex-1 space-y-3">
        <h1 className="text-xl font-bold drop-shadow-md mb-1">
          Select a friend
        </h1>
        {isLoading && <p>Loading...</p>}
        {data?.friends?.map((friend: Friend, i) => (
          <div
            key={i}
            onClick={handleSelect(friend.friend_id)}
            className={clsx(
              "flex items-center justify-between gap-2 p-2 bg-gradient-to-b from-gray-100 to-gray-200 rounded",
              {
                "outline outline-2 outline-blue-500":
                  selected === friend.friend_id,
              }
            )}
          >
            <p>{friend.friend_name}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="sticky bottom-16 mt-3">
          <button
            onClick={handleCreateBattle}
            className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:brightness-90 p-2 text-white rounded text-lg font-semibold"
          >
            Create Battle
          </button>
        </div>
      )}
    </main>
  )
}

export default Page
