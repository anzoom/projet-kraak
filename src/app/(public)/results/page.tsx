import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import ResultsStub from "@/components/features/results/ResultsStub"

export const metadata: Metadata = {
  title: "Tes résultats — KRAAK",
  description: "Découvre les opportunités les plus adaptées à ton profil.",
}

export default async function ResultsPage() {
  const supabase = await createSupabaseServerAnonClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col bg-slate-light">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-slate-dark tracking-tight">
          KRAAK
        </Link>
        {user && (
          <a
            href="/auth/logout"
            className="text-sm text-slate-mid hover:text-slate-dark transition-colors"
          >
            Déconnexion
          </a>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <ResultsStub />
      </main>
    </div>
  )
}
