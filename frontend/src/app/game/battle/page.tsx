import BattleScreen from "@/features/battle/components/BattleScreen"
import BottomScreen from "@/features/battle/components/BottomScreen"

const Page = () => {
  return (
    <main className="flex-1 flex flex-col">
      <BattleScreen />
      <BottomScreen />
    </main>
  )
}

export default Page
