"use client"

import InputField from "@/components/forms/InputField"
import { signInSchema } from "@/features/auth/schemas"
import { signInSchemaType } from "@/features/auth/types"
import { signIn } from "@/features/auth/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

const Page = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>()

  const { control, handleSubmit } = useForm<signInSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: signInSchemaType) => {
    setErrorMessage(null)
    const { error } = await signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/game/team")
        },
      },
    )
    setErrorMessage(error?.message)
  }

  return (
    <main className="flex flex-1 flex-col justify-center">
      <h1 className="mb-3 text-3xl font-bold drop-shadow-md">Sign In</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-stretch gap-5"
      >
        <InputField<signInSchemaType>
          control={control}
          label="Email"
          name="email"
          type="email"
          placeholder="jhon.doe@example.com"
        />
        <InputField<signInSchemaType>
          control={control}
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="rounded bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-2 text-lg font-semibold text-white hover:brightness-90"
        >
          Sign In
        </button>
      </form>

      <p className="mt-1 text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="mt-1 text-sm text-pokeBlue">
          Sign Up
        </Link>
      </p>
    </main>
  )
}

export default Page
