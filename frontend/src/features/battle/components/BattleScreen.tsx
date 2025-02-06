import Image from "next/image"

const BattleScreen = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#818cf8] to-[#73ca7c] rounded-b-lg max-h-[500px] relative">
      <div className="flex justify-between w-full items-center px-10">
        <div className="px-4 py-2 bg-gray-200 rounded-lg w-52">
          <p className="text-lg font-semibold">Pokemon Name</p>
          <div className="flex items-center gap-1 bg-gray-700 px-1 rounded-lg ml-10">
            <p className="text-[10px] text-white font-extrabold">HP</p>
            <div className="h-2 w-full bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="relative scale-90">
          <Image
            className="z-10 relative"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/132.png"
            alt="pokemon"
            width={200}
            height={200}
          />
          <div
            className="absolute top-20 right-0 w-full scale-150"
            style={{ perspective: "1000px" }}
          >
            <div
              style={{ transform: "rotateX(70deg)" }}
              className=" bg-[#89769e] border-8 rounded-full border-[#76658a] aspect-square w-full shadow-2xl"
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full items-center px-10">
        <div className="relative scale-110">
          <Image
            className="z-10 relative"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/132.png"
            alt="pokemon"
            width={200}
            height={200}
          />
          <div
            className="absolute top-20 right-0 w-full scale-150"
            style={{ perspective: "1000px" }}
          >
            <div
              style={{ transform: "rotateX(70deg)" }}
              className=" bg-[#89769e] border-8 rounded-full border-[#76658a] aspect-square w-full shadow-2xl"
            ></div>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-200 rounded-lg w-52">
          <p className="text-lg font-semibold">Pokemon Name</p>
          <div className="flex items-center gap-1 bg-gray-700 px-1 rounded-lg ml-10">
            <p className="text-[10px] text-white font-extrabold">HP</p>
            <div className="h-2 w-full bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="message bg-gray-700/80 border-t-2 border-gray-200/80 text-white font-semibold text-lg absolute bottom-0 w-full p-4 h-28 rounded-t-lg">
        <p>Eevee use quick attack</p>
      </div>
    </div>
  )
}

export default BattleScreen
