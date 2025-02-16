"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import AddFirend from "@/features/friend/components/AddFirend"
import FriendRow from "@/features/friend/components/FriendRow"
import { useFriend } from "@/features/friend/services"
import { Friend } from "@/features/friend/types"
import { Frown } from "lucide-react"

const Page = () => {
  const { data, isLoading, isError } = useFriend()

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <main className="relative mt-3 flex flex-1 flex-col">
      <div className="flex flex-1 flex-col space-y-3 divide-y-2 divide-gray-200">
        <div>
          <h2 className="mb-1 text-xl font-bold drop-shadow-md">Add Friend</h2>
          <AddFirend />
        </div>

        {!!data?.requests?.length && (
          <div>
            <h2 className="mb-1 text-xl font-bold drop-shadow-md">Requests</h2>
            {data?.requests?.map((friend: Friend, i) => (
              <FriendRow key={i} friend={friend} />
            ))}
          </div>
        )}

        <div>
          <h2 className="mb-1 text-xl font-bold drop-shadow-md">Friends</h2>
          {data?.friends?.map((friend: Friend, i) => (
            <FriendRow key={i} friend={friend} />
          ))}

          {!data?.friends?.length && (
            <div className="mx-auto mt-5 flex flex-col items-center text-gray-500">
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
