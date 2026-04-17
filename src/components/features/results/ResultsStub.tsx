"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ScoringOutput } from "@/types/scoring"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"
const STORAGE_KEY_RESULT = "kraak_scoring_result"

const SEGMENT_CONFIG = {
  Explorer: {
    emoji: "🔍",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Explorer",
    description: "Tu débutes ton parcours. Les opportunités adaptées à ton profil t'attendent.",
  },
  Candidat: {
    emoji: "🚀",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "Candidat",
    description: "Ton profil est en bonne voie. Plusieurs opportunités correspondent à ton niveau.",
  },
  Finaliste: {
    emoji: "🏆",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Finaliste",
    description: "Ton profil est très solide. Tu as de fortes chances d'accéder aux meilleures opportunités.",
  },
} as const

export default function ResultsStub() {
  const [score, setScore] = useState<ScoringOutput | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    async function loadScore() {
      try {
        const cached = localStorage.getItem(STORAGE_KEY_RESULT)
        if (cached) {
          const parsed = JSON.parse(cached) as { score: ScoringOutput }
          setScore(parsed.score)
          setHydrated(true)
          return
        }

        // Pas de score en cache — calculer depuis les réponses (ex: retour après confirmation email)
        const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION)
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw) as { answers?: Record<string, string> }
          const answers = session.answers
          if (answers && Object.keys(answers).length > 0) {
            const res = await fetch("/api/scoring", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers }),
            })
            if (res.ok) {
              const computed: ScoringOutput = await res.json()
              localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify({ answers, score: computed }))
              setScore(computed)
            }
          }
        }
      } catch {
        // localStorage inaccessible
      }
      setHydrated(true)
    }
    loadScore()
  }, [])

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!score) {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-4xl mb-4">📋</p>
        <h2 className="text-xl font-bold text-slate-dark mb-2">Aucun résultat trouvé</h2>
        <p className="text-slate-mid text-sm mb-6">
          Complète le test de profil pour découvrir les opportunités qui te correspondent.
        </p>
        <Link
          href="/test"
          className="inline-flex items-center h-12 px-8 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-md shadow-orange-100 transition-colors"
        >
          Faire le test
        </Link>
      </div>
    )
  }

  const config = SEGMENT_CONFIG[score.segment as keyof typeof SEGMENT_CONFIG] ?? SEGMENT_CONFIG.Explorer

  return (
    <div className="w-full max-w-md">
      <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 mb-6 text-center`}>
        <p className="text-5xl mb-3">{config.emoji}</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-mid mb-1">Ton profil</p>
        <h2 className={`text-3xl font-black ${config.color} mb-2`}>{config.label}</h2>
        <p className="text-slate-mid text-sm">{config.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Académique", value: Math.round(score.academic_score) },
          { label: "Financier", value: Math.round(score.financial_score) },
          { label: "Maturité", value: Math.round(score.maturity_score) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border-2 border-gray-100 p-3 text-center">
            <p className="text-xl font-black text-slate-dark">{value}</p>
            <p className="text-xs text-slate-mid mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 text-center">
        <p className="text-slate-mid text-sm mb-1">Les recommandations complètes arrivent bientôt.</p>
        <p className="text-xs text-slate-mid">Score global : {Math.round(score.global_score)}/100</p>
      </div>
    </div>
  )
}
