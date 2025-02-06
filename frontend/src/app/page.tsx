"use client"

import { authClient } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const signUp = async () =>
    await authClient.signUp.email(
      {
        email: "test@localhost.local",
        name: "test",
        password: "123456789",
      },
      {
        onError: (ctx) => {
          alert(ctx.error)
        },
      }
    )

  const signIn = async () =>
    await authClient.signIn.email(
      {
        email: "test@localhost.local",
        password: "123456789",
      },
      {
        onError: (ctx) => {
          alert(ctx.error)
        },
      }
    )

  const session = authClient.useSession()

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <Image
        src="/pokémon_logo.svg"
        alt="Pokémon Logo"
        width={300}
        height={300}
      ></Image>
      <h2 className="text-3xl font-semibold text-pokeBlue">Weater Battle</h2>
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
