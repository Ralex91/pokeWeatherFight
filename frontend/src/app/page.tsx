"use client"

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Image
        src="/pokémon_logo.svg"
        alt="Pokémon Logo"
        width={300}
        height={300}
      ></Image>
      <h2 className="text-3xl font-semibold text-pokeBlue">Weather Battle</h2>
      <div className="mt-10 flex gap-5">
        <Link
          href="/signup"
          className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
        >
          Sign Up
        </Link>
        <Link
          href="/signin"
          className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
