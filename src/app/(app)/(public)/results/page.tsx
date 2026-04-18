import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { fetchOpportunities } from "@/lib/opportunities"
import { prisma } from "@/lib/prisma"
import ResultsClient from "@/components/features/results/ResultsClient"

export const metadata: Metadata = {
  title: "Tes résultats — KRAAK",
  description: "Découvre les opportunités les plus adaptées à ton profil.",
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const needsScoring = params.needs_scoring === "true"

  // Vérification server-side du PurchaseAccess
  let hasAccess = false
  if (user) {
    const prismaUser = await prisma.user.findUnique({
      where: { supabase_uid: user.id },
    })
    if (prismaUser) {
      const access = await prisma.purchaseAccess.findFirst({
        where: {
          user_id: prismaUser.id,
          expires_at: { gt: new Date() },
        },
      })
      hasAccess = access !== null
    }
  }

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
        <ResultsClient
          opportunities={opportunities}
          needsScoring={needsScoring}
          hasAccess={hasAccess}
        />
      </main>
    </div>
  )
}
