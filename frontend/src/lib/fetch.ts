import ky from "ky"

export const client = ky.create({
  prefixUrl: `${process.env.NEXT_PUBLIC_BACKEND_API}/api`,
  credentials: "include",
})
