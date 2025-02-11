"use client"

import InputField from "@/components/forms/InputField"
import { useSession } from "@/features/auth/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { addFriendSchema } from "../schemas"
import { addFriendSchemaType } from "../types"
import { useAddFriend } from "./../services"

const AddFirend = () => {
  const { data: session } = useSession()
  const { mutateAsync } = useAddFriend()
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
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-5 w-full"
      >
        <div className="flex gap-2">
          <div className="flex-1">
            <InputField<addFriendSchemaType> control={control} name="userId" />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-b from-blue-500 to-blue-700 hover:brightness-90 text-white font-semibold py-2 px-4 rounded"
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
