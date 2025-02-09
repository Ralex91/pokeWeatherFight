"use client"

import TeamSlot from "@/components/team/TeamSlot"
import { useTeam } from "@/services/team"

const Page = () => {
  const { data, isLoading, isError } = useTeam()

  return (
    <main className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold drop-shadow-md">Team</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      <div className="grid grid-cols-2 gap-2 my-3">
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
