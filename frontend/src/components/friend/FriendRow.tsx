"use client"

import { useSession } from "@/lib/auth"
import { useAcceptFriend, useDeleteFriend } from "@/services/friend"
import { Friend } from "@/types/friend"
import { Check, X } from "lucide-react"
import toast from "react-hot-toast"

type Props = {
  friend: Friend
}

const FriendRow = ({ friend }: Props) => {
  const { data: session } = useSession()
  const { mutateAsync: acceptFriend } = useAcceptFriend()
  const { mutateAsync: deleteFriend } = useDeleteFriend()

  const showAccept = friend.friend_id === session?.user?.id && !friend.accepted

  const accept = async () => {
    await acceptFriend(friend.user_id)
    toast.success("Friend accepted")
  }

  const remove = async () => {
    await deleteFriend(friend.friend_id)
    toast.success("Friend removed")
  }

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-gradient-to-b from-gray-100 to-gray-200 rounded">
      <p>{friend.friend_name}</p>
      <div className="flex items-stretch">
        {showAccept && (
          <button
            onClick={accept}
            className="hover:bg-black/10 text-green-500 rounded p-1"
          >
            <Check size={18} />
          </button>
        )}
        <button
          onClick={remove}
          className="hover:bg-black/10 text-red-500 rounded p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default FriendRow
