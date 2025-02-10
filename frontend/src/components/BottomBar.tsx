import { Home, Swords, UsersRound, WalletCards } from "lucide-react"
import Link from "next/link"

const BottomBar = () => {
  return (
    <div className="sticky bottom-0 rounded-t-lg p-4 bg-gradient-to-b from-blue-100 to-gray-100 flex justify-between px-20 gap-5">
      <Link className="text-gray-800" href="/game">
        <Home />
      </Link>
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
