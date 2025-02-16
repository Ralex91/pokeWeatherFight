import { AlertCircle } from "lucide-react"

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center p-4 my-4">
    <AlertCircle size={40} className="text-red-500 mt-0.5" />
    <div className="mt-2">
      <p className="text-sm text-red-700">
        Something went wrong, please try again later
      </p>
    </div>
  </div>
)

export default ErrorState
