import { authClient } from "@/lib/auth"
import { betterFetch } from "@better-fetch/fetch"
import { NextResponse, type NextRequest } from "next/server"

type Session = typeof authClient.$Infer.Session

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  )

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/game/:path*"],
}
