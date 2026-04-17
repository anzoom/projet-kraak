import type { Recommendation } from "@/types/scoring"

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
  none: "Sans financement",
}

function formatDeadline(deadline: string): string {
  const d = new Date(deadline)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

interface Props {
  recommendation: Recommendation
  rank: number
}

export default function RecommendationCard({ recommendation, rank }: Props) {
  const { opportunity, match_score, justification } = recommendation

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
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
        <span className="shrink-0 text-xs font-black text-slate-mid bg-slate-light rounded-lg px-2 py-1">
          #{rank}
        </span>
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
        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-gray-100 text-slate-mid text-xs">
          Score : {match_score} pts
        </span>
      </div>

      <p className="text-xs text-slate-mid leading-relaxed">
        <span className="font-semibold text-slate-dark">Pourquoi ce match :</span>{" "}
        {justification}
      </p>
    </div>
  )
}
