import { z } from "zod"
import { signInSchema, signUpSchema } from "./schemas"

export type signInSchemaType = z.infer<typeof signInSchema>
export type signUpSchemaType = z.infer<typeof signUpSchema>
