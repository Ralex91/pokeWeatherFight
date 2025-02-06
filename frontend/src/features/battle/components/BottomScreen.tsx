import { Swords, WalletCards } from "lucide-react"

const BottomScreen = () => {
  return (
    <div className="flex-1 flex-col gap-5 flex my-4">
      <button className="flex-1 bg-gradient-to-b from-[#f8819b] to-[#fd1952] hover:brightness-90 rounded-xl">
        <div className="text-white text-3xl font-bold flex items-center justify-center gap-2">
          <Swords size={30} />
          Attack
        </div>
      </button>
      <button className="flex-1 bg-gradient-to-b from-[#81a7f8] to-[#1943fd] hover:brightness-90 rounded-xl">
        <div className="text-white text-3xl font-bold flex items-center justify-center gap-2">
          <WalletCards size={30} />
          Pokemon
        </div>
      </button>
    </div>
  )
}

export default BottomScreen
