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
      }
    )
    setErrorMessage(error?.message)
  }

  return (
    <main className="flex-1 flex flex-col justify-center">
      <h1 className="text-3xl drop-shadow-md font-bold mb-3">Sign In</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-5 w-full"
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
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          type="submit"
          className="px-4 py-2 rounded font-semibold text-lg text-white bg-gradient-to-b from-blue-500 to-blue-700 hover:brightness-90"
        >
          Sign In
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-1">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-sm text-pokeBlue mt-1">
          Sign Up
        </Link>
      </p>
    </main>
  )
}

export default Page
