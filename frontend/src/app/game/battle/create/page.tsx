"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
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
  const { data, isLoading, isError } = useFriend()
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

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <main className="relative my-3 flex flex-1 flex-col">
      <div className="flex-1 space-y-3">
        <h1 className="mb-1 text-xl font-bold drop-shadow-md">
          Select a friend
        </h1>
        {data?.friends?.map((friend: Friend, i) => (
          <div
            key={i}
            onClick={handleSelect(friend.friend_id)}
            className={clsx(
              "flex cursor-pointer items-center justify-between gap-2 rounded bg-gradient-to-b from-gray-100 to-gray-200 p-2",
              {
                "outline outline-2 outline-blue-500":
                  selected === friend.friend_id,
              },
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
            className="w-full rounded bg-gradient-to-b from-blue-500 to-blue-700 p-2 text-lg font-semibold text-white hover:brightness-90"
          >
            Create Battle
          </button>
        </div>
      )}
    </main>
  )
}

export default Page
