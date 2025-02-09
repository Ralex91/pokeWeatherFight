import { HTTPError } from "ky"
import toast from "react-hot-toast"

export interface ServerError {
  error: string
  code?: string
}

export type QueryError = HTTPError | Error

export const handleQueryError = async (error: QueryError): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const errorData = (await error.response.json()) as ServerError
      console.error("Server error:", errorData)

      return errorData.error || "Something went wrong"
    } catch (error) {
      console.error("Error parsing error response:", error)

      return "Something went wrong"
    }
  }

  console.error("Client error:", error)
  return error.message || "Something went wrong"
}

export const createErrorHandler = (customMessage?: string) => {
  return async (error: QueryError) => {
    const message = await handleQueryError(error)
    toast.error(customMessage || message)
  }
}

export type QueryErrorHandler = (error: QueryError) => Promise<void>
