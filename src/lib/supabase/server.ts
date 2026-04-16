import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase server client — utilise SUPABASE_SERVICE_ROLE_KEY
 * À utiliser exclusivement côté serveur (Server Components, API Routes, middleware)
 * Ne jamais exposer ce client au navigateur
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll peut échouer dans les Server Components en lecture seule — ignoré
          }
        },
      },
    }
  )
}

/**
 * Supabase server client avec clé anon — pour vérifier les JWT utilisateurs
 * Utilise NEXT_PUBLIC_SUPABASE_ANON_KEY (ne donne pas de droits élevés)
 */
export async function createSupabaseServerAnonClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignoré en Server Components lecture seule
          }
        },
      },
    }
  )
}
