import { Swords, UsersRound, WalletCards } from "lucide-react"
import Link from "next/link"

const BottomBar = () => {
  return (
    <div className="sticky bottom-0 flex justify-between gap-5 rounded-t-lg bg-gradient-to-b from-blue-100 to-gray-100 p-4 px-20">
      <Link className="text-gray-800" href="/game/team">
        <WalletCards />
      </Link>
      <Link className="text-gray-800" href="/game/friend">
        <UsersRound />
      </Link>
      <Link className="text-gray-800" href="/game/battle">
        <Swords />
      </Link>
    </div>
  )
}

export default BottomBar
