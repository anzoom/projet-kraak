"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import posthog from "posthog-js"
import type { Recommendation } from "@/types/scoring"
import OpportunityDetailModal from "./OpportunityDetailModal"
import SaveButton from "./SaveButton"

const CATEGORY_LABELS: Record<string, string> = {
  bourse: "Bourse",
  formation: "Formation",
  echange: "Programme d'échange",
  stage: "Stage",
  emploi: "Emploi",
}

const FUNDING_LABELS: Record<string, string> = {
  complete: "Financement complet",
  partial: "Financement partiel",
  non_financee: "Sans financement",
  salariee: "Rémunéré",
}

function formatDeadline(deadline: string): string {
  const d = new Date(deadline)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

interface Props {
  recommendation: Recommendation
  rank: number
}

const BADGE_CONFIG = {
  top: { label: "🔥 Top recommandé pour toi", className: "bg-orange-50 text-primary border border-orange-200" },
  probability: { label: "🎯 Forte probabilité d'acceptation", className: "bg-green-50 text-green-700 border border-green-200" },
} as const

export default function RecommendationCard({ recommendation, rank }: Props) {
  const { opportunity, match_score, justification, badge } = recommendation
  const [showDetail, setShowDetail] = useState(false)

  const isHighlighted = badge === "top"

  return (
    <>
      <div className={[
        "bg-white rounded-2xl border-2 p-5",
        isHighlighted ? "border-primary/30 shadow-sm shadow-orange-100" : "border-gray-100",
      ].join(" ")}>
        {badge && (
          <span className={[
            "inline-flex items-center h-6 px-2.5 rounded-full text-xs font-semibold mb-3",
            BADGE_CONFIG[badge].className,
          ].join(" ")}>
            {BADGE_CONFIG[badge].label}
          </span>
        )}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary-light text-primary text-xs font-semibold">
                {CATEGORY_LABELS[opportunity.category] ?? opportunity.category}
              </span>
              <span className="text-xs text-slate-mid capitalize">{opportunity.country}</span>
            </div>
            <h3 className="text-base font-bold text-slate-dark leading-snug">
              {opportunity.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-black text-slate-mid bg-slate-light rounded-lg px-2 py-1">
              #{rank}
            </span>
            <SaveButton opportunityId={opportunity.id} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-gray-100 text-slate-mid text-xs">
            {FUNDING_LABELS[opportunity.funding_type] ?? opportunity.funding_type}
          </span>
          {opportunity.deadline && (
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-gray-100 text-slate-mid text-xs">
              Deadline : {formatDeadline(opportunity.deadline)}
            </span>
          )}
        </div>

        {opportunity.short_description && (
          <p className="text-sm text-slate-mid leading-relaxed mb-3 line-clamp-2">
            {opportunity.short_description}
          </p>
        )}

        <p className="text-xs text-slate-mid leading-relaxed mb-4">
          <span className="font-semibold text-slate-dark">Pourquoi ce match :</span>{" "}
          {justification}
        </p>

        <div className="flex flex-col gap-2">
          {opportunity.source_url && (
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog.capture("opportunity_source_clicked", {
                opportunity_id: opportunity.id,
                opportunity_title: opportunity.title,
                source_url: opportunity.source_url,
              })}
              className="w-full h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              Postuler
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => {
              posthog.capture("opportunity_clicked", {
                opportunity_id: opportunity.id,
                opportunity_title: opportunity.title,
                badge: badge ?? null,
              })
              setShowDetail(true)
            }}
            className="w-full h-11 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
          >
            Voir les détails
          </button>
        </div>
      </div>

      {showDetail && (
        <OpportunityDetailModal
          opportunity={opportunity}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
}
