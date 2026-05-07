import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/results"

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Envoyer l'email de bienvenue (idempotent via welcome_sent)
      try {
        await fetch(`${origin}/api/user/welcome`, {
          method: "POST",
          headers: { cookie: request.headers.get("cookie") ?? "" },
        })
      } catch {
        // non bloquant
      }

      const from = searchParams.get("from")
      const redirectUrl = new URL(`${origin}${next}`)
      if (from === "test") {
        redirectUrl.searchParams.set("needs_scoring", "true")
      }
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  return NextResponse.redirect(`${origin}/auth/confirm-error`)
}
