import { auth } from "@/lib/auth.ts"

export type HonoContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}
