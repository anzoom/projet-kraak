"use client"

import Link from "next/link"
import posthog from "posthog-js"
import type { Recommendation } from "@/types/scoring"

interface Props {
  recommendations: Recommendation[]
}

export default function CoachingUpsell({ recommendations }: Props) {
  if (recommendations.length === 0) return null

  const priorityCount = Math.min(
    recommendations.filter((r) => r.badge === "top" || r.badge === "probability").length,
    3,
  )
  const displayCount = priorityCount > 0 ? priorityCount : Math.min(recommendations.length, 3)

  return (
    <div className="w-full bg-gradient-to-br from-slate-dark to-slate-800 rounded-2xl p-6 text-white">
      <p className="text-xl font-black mb-2 leading-snug">
        🔥 {displayCount} opportunité{displayCount > 1 ? "s sont" : " est"} particulièrement adaptée{displayCount > 1 ? "s" : ""} à ton profil.
      </p>
      <p className="text-sm text-white/70 mb-5">
        Veux-tu maximiser tes chances d'être accepté ?
      </p>

      <p className="text-xs text-white/50 mb-4 leading-relaxed">
        Ces opportunités méritent une candidature optimisée pour maximiser tes chances.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/coaching#audit"
          onClick={() => posthog.capture("coaching_cta_clicked", { cta_label: "Optimiser mon dossier" })}
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-md shadow-orange-900/30 flex-1"
        >
          Optimiser mon dossier →
        </Link>
        <Link
          href="/coaching#accompagnement"
          onClick={() => posthog.capture("coaching_cta_clicked", { cta_label: "Être accompagné" })}
          className="inline-flex items-center justify-center h-12 px-6 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex-1"
        >
          Être accompagné
        </Link>
      </div>
    </div>
  )
}
