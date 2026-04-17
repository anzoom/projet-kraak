"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ScoringOutput, Opportunity, Recommendation } from "@/types/scoring"
import { matchOpportunities } from "@/domain/matching/matcher"
import ScoreCard from "./ScoreCard"
import RecommendationCard from "./RecommendationCard"
import PaywallSection from "./PaywallSection"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"
const STORAGE_KEY_RESULT = "kraak_scoring_result"
const FREE_LIMIT = 2

interface Props {
  opportunities: Opportunity[]
}

type State =
  | { status: "loading" }
  | { status: "no_data" }
  | { status: "ready"; score: ScoringOutput; recommendations: Recommendation[] }

export default function ResultsClient({ opportunities }: Props) {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    async function load() {
      try {
        let score: ScoringOutput | null = null
        let answers: Record<string, string> | null = null

        const cached = localStorage.getItem(STORAGE_KEY_RESULT)
        if (cached) {
          const parsed = JSON.parse(cached) as {
            score: ScoringOutput
            answers?: Record<string, string>
          }
          score = parsed.score
          answers = parsed.answers ?? null
        }

        if (!score) {
          const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION)
          if (sessionRaw) {
            const session = JSON.parse(sessionRaw) as {
              answers?: Record<string, string>
            }
            answers = session.answers ?? null
            if (answers && Object.keys(answers).length > 0) {
              const res = await fetch("/api/scoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
              })
              if (res.ok) {
                score = (await res.json()) as ScoringOutput
                localStorage.setItem(
                  STORAGE_KEY_RESULT,
                  JSON.stringify({ answers, score }),
                )
              }
            }
          }
        }

        if (!score || !answers) {
          setState({ status: "no_data" })
          return
        }

        const recommendations = matchOpportunities({
          score,
          answers,
          opportunities,
        })

        setState({ status: "ready", score, recommendations })
      } catch {
        setState({ status: "no_data" })
      }
    }

    load()
  }, [opportunities])

  if (state.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-mid">Analyse de ton profil…</p>
      </div>
    )
  }

  if (state.status === "no_data") {
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

  const { score, recommendations } = state
  const free = recommendations.slice(0, FREE_LIMIT)
  const locked = recommendations.slice(FREE_LIMIT)

  return (
    <div className="w-full max-w-lg space-y-6">
      <ScoreCard score={score} />

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
          <p className="text-3xl mb-3">🔧</p>
          <p className="text-slate-dark font-semibold mb-1">
            Catalogue en cours de construction
          </p>
          <p className="text-slate-mid text-sm">
            Les opportunités seront bientôt disponibles. Reviens dans quelques jours.
          </p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-black text-slate-dark mb-3">
              Tes recommandations
            </h2>
            <div className="space-y-3">
              {free.map((rec, i) => (
                <RecommendationCard
                  key={rec.opportunity.id}
                  recommendation={rec}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>

          {locked.length > 0 && <PaywallSection locked={locked} />}
        </>
      )}
    </div>
  )
}
