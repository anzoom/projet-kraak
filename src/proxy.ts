import { createServerClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { isRateLimited } from "@/lib/upstash"

// Routes protégées par JWT Supabase
const PROTECTED_ROUTES = ["/dashboard"]

// Routes soumises au rate limiting
const RATE_LIMITED_ROUTES = ["/auth/"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/** → Payload gère son propre middleware et JWT
  // On ne vérifie pas le JWT Supabase ici — séparation stricte des systèmes d'auth
  if (pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Rate limiting sur les routes sensibles
  const isRateLimitedRoute = RATE_LIMITED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isRateLimitedRoute) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    const blocked = await isRateLimited(`${ip}:${pathname.split("/")[2] ?? ""}`)

    if (blocked) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      })
    }
  }

  // Routes protégées → vérifier le JWT Supabase
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Vérification JWT Supabase
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Applique le middleware sur toutes les routes SAUF :
     * - _next/static (assets statiques)
     * - _next/image (optimisation images)
     * - favicon.ico, fichiers SVG/PNG/etc.
     * - / (landing page publique)
     * - /test (questionnaire public)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
