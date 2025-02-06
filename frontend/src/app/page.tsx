"use client"

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <Image
        src="/pokémon_logo.svg"
        alt="Pokémon Logo"
        width={300}
        height={300}
      ></Image>
      <h2 className="text-3xl font-semibold text-pokeBlue">Weather Battle</h2>
      <div className="flex gap-5 mt-10">
        <Link
          href="/signup"
          className="bg-slate-700 px-4 py-2 rounded text-white hover:bg-slate-600"
        >
          Sign Up
        </Link>
        <Link
          href="/signin"
          className="bg-slate-700 px-4 py-2 rounded text-white hover:bg-slate-600"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
