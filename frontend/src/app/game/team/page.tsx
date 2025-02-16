"use client"

import ErrorState from "@/components/ErrorState"
import LoadingState from "@/components/LoadingState"
import TeamSlot from "@/features/team/components/TeamSlot"
import { useTeam } from "@/features/team/services"

const Page = () => {
  const { data, isLoading, isError } = useTeam()

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <main className="mt-3 flex flex-1 flex-col">
      <h1 className="text-2xl font-bold drop-shadow-md">Team</h1>
      <div className="my-3 grid grid-cols-2 gap-2">
        {data?.map((pokemon, i) => (
          <TeamSlot key={i} slotId={i + 1} pokemon={pokemon} />
        ))}
        {data && data?.length < 6 && <TeamSlot slotId={data?.length + 1} />}
      </div>
      <div className="flex justify-end"></div>
    </main>
  )
}

export default Page
