"use client"

import AddFirend from "@/components/friend/AddFirend"
import FriendRow from "@/components/friend/FriendRow"
import { useSession } from "@/lib/auth"
import { useFriend } from "@/services/friend"
import { Friend } from "@/types/friend"
import { Frown } from "lucide-react"

const Page = () => {
  const { data: session } = useSession()
  const { data, isLoading, isError } = useFriend()

  return (
    <main className="flex-1 flex flex-col relative mt-3">
      <div className="flex-1 flex flex-col divide-y-2 divide-gray-200 space-y-3">
        <div>
          <h2 className="text-xl font-bold mb-1">Add Friend</h2>
          <AddFirend />
        </div>

        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}

        {!!data?.requests?.length && (
          <div>
            <h2 className="text-xl font-bold mb-1">Requests</h2>
            {data?.requests?.map((friend: Friend, i) => (
              <FriendRow key={i} friend={friend} />
            ))}
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-1">Friends</h2>
          {data?.friends?.map((friend: Friend, i) => (
            <FriendRow key={i} friend={friend} />
          ))}

          {!data?.friends?.length && (
            <div className="flex flex-col items-center mx-auto mt-5 text-gray-500">
              <Frown size={50} />
              <p>No friends</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Page
