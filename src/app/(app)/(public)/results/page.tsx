import type { Metadata } from "next"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { fetchOpportunities } from "@/lib/opportunities"
import ResultsClient from "@/components/features/results/ResultsClient"

export const metadata: Metadata = {
  title: "Tes résultats — KRAAK",
  description: "Découvre les opportunités les plus adaptées à ton profil.",
}

// Classic : jusqu'à 5 recommandations
// Premium : jusqu'à 20 recommandations — saves cap = 15 (anti-scraping)
const MAX_RESULTS_CLASSIC = 5
const MAX_RESULTS_PREMIUM = 20

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ needs_scoring?: string }>
}) {
  const [supabase, opportunities, params] = await Promise.all([
    createSupabaseServerAnonClient(),
    fetchOpportunities(),
    searchParams,
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const needsScoring = params.needs_scoring === "true"

  // Phase 2 : remplacer isPremiumUser par une vérification du rôle Supabase
  const isPremiumUser = false
  const maxResults = isPremiumUser ? MAX_RESULTS_PREMIUM : MAX_RESULTS_CLASSIC

  return (
    <div className="flex flex-col bg-slate-light">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <ResultsClient
          opportunities={opportunities}
          needsScoring={needsScoring}
          isAuthenticated={!!user}
          maxResults={maxResults}
        />
      </main>
    </div>
  )
}
