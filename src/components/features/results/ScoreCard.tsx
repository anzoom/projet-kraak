import type { ScoringOutput } from "@/types/scoring"

const SEGMENT_CONFIG = {
  Explorer: {
    emoji: "🔍",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description:
      "Tu débutes ton parcours. Les opportunités adaptées à ton profil t'attendent.",
  },
  Candidat: {
    emoji: "🚀",
    color: "text-primary",
    bg: "bg-primary-light",
    border: "border-orange-200",
    description:
      "Ton profil est en bonne voie. Plusieurs opportunités correspondent à ton niveau.",
  },
  Finaliste: {
    emoji: "🏆",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    description:
      "Ton profil est très solide. Tu as de fortes chances d'accéder aux meilleures opportunités.",
  },
} as const

interface Props {
  score: ScoringOutput
}

export default function ScoreCard({ score }: Props) {
  const config =
    SEGMENT_CONFIG[score.segment as keyof typeof SEGMENT_CONFIG] ??
    SEGMENT_CONFIG.Explorer

  return (
    <div className="w-full">
      <div
        className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 mb-4 text-center`}
      >
        <p className="text-5xl mb-3">{config.emoji}</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-mid mb-1">
          Ton profil
        </p>
        <h2 className={`text-3xl font-black ${config.color} mb-1`}>
          {score.segment}
        </h2>
        <p className="text-slate-mid text-sm">{config.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Académique", value: Math.round(score.academic_score) },
          { label: "Financier", value: Math.round(score.financial_score) },
          { label: "Maturité", value: Math.round(score.maturity_score) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl border-2 border-gray-100 p-3 text-center"
          >
            <p className="text-xl font-black text-slate-dark">{value}</p>
            <p className="text-xs text-slate-mid mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 px-4 py-3 text-center">
        <p className="text-xs text-slate-mid">Score global</p>
        <p className="text-2xl font-black text-slate-dark">
          {Math.round(score.global_score)}
          <span className="text-sm font-medium text-slate-mid">/100</span>
        </p>
      </div>
    </div>
  )
}
