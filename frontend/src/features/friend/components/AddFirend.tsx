"use client"

import InputField from "@/components/forms/InputField"
import { useSession } from "@/features/auth/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { addFriendSchema } from "../schemas"
import { addFriendSchemaType } from "../types"
import { useAddFriend } from "./../services"

const AddFirend = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { mutateAsync } = useAddFriend(queryClient)
  const form = useForm({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      userId: "",
    },
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: addFriendSchemaType) => {
    await mutateAsync(data.userId)
    toast.success("Friend added")
    form.reset()
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-stretch gap-5"
      >
        <div className="flex gap-2">
          <div className="flex-1">
            <InputField<addFriendSchemaType> control={control} name="userId" />
          </div>

          <button
            type="submit"
            className="rounded bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-2 font-semibold text-white hover:brightness-90"
          >
            Add
          </button>
        </div>
      </form>
      <p className="text-sm">
        Your friend id:{" "}
        <span className="font-semibold">{session?.user?.id}</span>
      </p>
    </div>
  )
}

export default AddFirend
