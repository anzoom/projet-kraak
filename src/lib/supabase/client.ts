"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Supabase browser client — utilise NEXT_PUBLIC_SUPABASE_ANON_KEY uniquement
 * SUPABASE_SERVICE_ROLE_KEY n'est jamais accessible ici
 * À utiliser dans les Client Components uniquement
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
