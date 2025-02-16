"use client"

import { useSession } from "@/features/auth/utils"
import { useQueryClient } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import toast from "react-hot-toast"
import { useAcceptFriend, useDeleteFriend } from "./../services"
import { Friend } from "./../types"

type Props = {
  friend: Friend
}

const FriendRow = ({ friend }: Props) => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { mutateAsync: acceptFriend } = useAcceptFriend(queryClient)
  const { mutateAsync: deleteFriend } = useDeleteFriend(queryClient)

  const showAccept =
    friend.requester_id !== session?.user?.id && !friend.accepted

  const accept = async () => {
    await acceptFriend(friend.id)
    toast.success("Friend accepted")
  }

  const remove = async () => {
    await deleteFriend(friend.id)
    toast.success("Friend removed")
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-gradient-to-b from-gray-100 to-gray-200 p-2">
      <p>{friend.friend_name}</p>
      <div className="flex items-stretch">
        {showAccept && (
          <button
            onClick={accept}
            className="rounded p-1 text-green-500 hover:bg-black/10"
          >
            <Check size={18} />
          </button>
        )}
        <button
          onClick={remove}
          className="rounded p-1 text-red-500 hover:bg-black/10"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default FriendRow
