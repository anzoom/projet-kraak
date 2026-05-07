import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { fetchOpportunities } from "@/lib/opportunities"
import CatalogClient from "@/components/features/catalog/CatalogClient"
import UpsellGuide from "@/components/features/catalog/UpsellGuide"

export const metadata: Metadata = {
  title: "Catalogue — KRAAK",
}

export default async function CatalogPage() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/catalog")
  }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })

  let hasAccess = false
  if (dbUser) {
    const sub = await prisma.guideSubscription.findFirst({
      where: {
        user_id: dbUser.id,
        status: { in: ["ACTIVE", "CANCELLED"] },
        current_period_end: { gt: new Date() },
      },
    })
    hasAccess = !!sub
  }

  const CATALOG_LIMIT = 30
  const allOpportunities = await fetchOpportunities()
  const now = Date.now()

  // Actives en premier (par deadline croissante), permanentes ensuite
  const active = allOpportunities
    .filter((o) => !o.deadline || new Date(o.deadline).getTime() > now)
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  const opportunities = active.slice(0, CATALOG_LIMIT)
  const totalActiveCount = active.length

  return (
    <div className="bg-slate-light">
      <main className="max-w-lg mx-auto px-4 py-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Guide
        </Link>
        {hasAccess ? (
          <CatalogClient opportunities={opportunities} totalCount={totalActiveCount} />
        ) : (
          <UpsellGuide
            previewOpportunities={opportunities.slice(0, 3)}
            totalCount={totalActiveCount}
          />
        )}
      </main>
    </div>
  )
}
