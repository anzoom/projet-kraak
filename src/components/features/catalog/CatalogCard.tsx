"use client"

import { useState } from "react"
import posthog from "posthog-js"
import type { Opportunity } from "@/types/scoring"
import OpportunityDetailModal from "@/components/features/results/OpportunityDetailModal"
import SaveButton from "@/components/features/results/SaveButton"
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities"

const CATEGORY_LABELS: Record<string, string> = {
  bourse: "Bourse",
  programme: "Programme",
  fellowship: "Fellowship",
  concours: "Concours",
  prix: "Prix",
  autre: "Autre",
}

const ZONE_LABELS: Record<string, string> = {
  afrique: "Afrique",
  europe: "Europe",
  amerique_nord: "Amérique du Nord",
  asie: "Asie",
  amerique_sud: "Amérique du Sud",
  moyen_orient: "Moyen-Orient",
  oceanie: "Océanie",
  international: "International / Mondial",
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

function isDeadlineSoon(deadline: string): boolean {
  const now = Date.now()
  const d = new Date(deadline).getTime()
  return d > now && d <= now + 30 * 24 * 60 * 60 * 1000
}

function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

interface Props {
  opportunity: Opportunity
}

export default function CatalogCard({ opportunity }: Props) {
  const [showDetail, setShowDetail] = useState(false)
  const { isSaved, toggle } = useSavedOpportunities({ isPremium: true, isAuthenticated: true })
  const isExpired = !!(opportunity.deadline && isDeadlinePassed(opportunity.deadline))
  const soon = !!(opportunity.deadline && !isExpired && isDeadlineSoon(opportunity.deadline))

  return (
    <>
      <div className={[
        "bg-white rounded-2xl border-2 p-5",
        isExpired ? "border-gray-200 opacity-80" : "border-gray-100",
      ].join(" ")}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary-light text-primary text-xs font-semibold">
                {CATEGORY_LABELS[opportunity.category] ?? opportunity.category}
              </span>
              <span className="text-xs text-slate-mid">{ZONE_LABELS[opportunity.country] ?? opportunity.country}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-dark leading-snug">
              {opportunity.title}
            </h3>
          </div>
          <SaveButton
            saved={isSaved(opportunity.id)}
            onToggle={() => toggle(opportunity.id)}
            isPremium={true}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-gray-100 text-slate-mid text-xs">
            {FUNDING_LABELS[opportunity.funding_type] ?? opportunity.funding_type}
          </span>
          {opportunity.deadline && (
            <span className={[
              "inline-flex items-center h-6 px-2.5 rounded-full text-xs",
              isExpired
                ? "bg-gray-100 text-gray-400 line-through"
                : soon
                  ? "bg-orange-50 text-orange-600"
                  : "bg-gray-100 text-slate-mid",
            ].join(" ")}>
              {isExpired ? "Éd. " : soon ? "⏰ " : "Date limite : "}{formatDeadline(opportunity.deadline)}
            </span>
          )}
        </div>

        {opportunity.short_description && (
          <p className="text-xs text-slate-mid leading-relaxed mb-3 line-clamp-2">
            {opportunity.short_description}
          </p>
        )}

        <button
          onClick={() => {
            posthog.capture("catalog_opportunity_clicked", {
              opportunity_id: opportunity.id,
              opportunity_title: opportunity.title,
            })
            setShowDetail(true)
          }}
          className="w-full h-10 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          Voir les détails
        </button>
      </div>

      {showDetail && (
        <OpportunityDetailModal
          opportunity={opportunity}
          onClose={() => setShowDetail(false)}
          isExpired={isExpired}
        />
      )}
    </>
  )
}
