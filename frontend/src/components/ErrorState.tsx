import { AlertCircle } from "lucide-react"

const ErrorState = () => (
  <div className="my-4 flex flex-col items-center justify-center p-4">
    <AlertCircle size={40} className="mt-0.5 text-red-500" />
    <div className="mt-2">
      <p className="text-sm text-red-700">
        Something went wrong, please try again later
      </p>
    </div>
  </div>
)

export default ErrorState
