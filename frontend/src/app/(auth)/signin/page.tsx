"use client"
import InputField from "@/components/forms/InputField"
import { signIn } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type FormData = {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
})

const Page = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>()

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null)
    const { error } = await signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/game")
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
        <InputField<FormData>
          control={control}
          label="Email"
          name="email"
          type="email"
          placeholder="jhon.doe@example.com"
        />
        <InputField<FormData>
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
