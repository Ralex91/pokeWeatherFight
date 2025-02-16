import React from "react"
import { Control, FieldValues, Path, useController } from "react-hook-form"

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  type?: "text" | "email" | "password"
  placeholder?: string
  control: Control<T>
}

const InputField = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  control,
}: InputFieldProps<T>): React.ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        className="rounded bg-slate-200 px-4 py-2"
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default InputField
