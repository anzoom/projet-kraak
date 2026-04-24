"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import type { ScoringOutput, Opportunity, Recommendation } from "@/types/scoring"
import { matchOpportunities } from "@/domain/matching/matcher"
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities"
import ScoreCard from "./ScoreCard"
import RecommendationCard from "./RecommendationCard"
import PaywallSection from "./PaywallSection"
import CoachingUpsell from "./CoachingUpsell"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"
const STORAGE_KEY_RESULT = "kraak_scoring_result"
const MAX_RESULTS = 5

function answersMatch(a: Record<string, string>, b: Record<string, string>): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  return keysA.every((k) => a[k] === b[k])
}

interface Props {
  opportunities: Opportunity[]
  needsScoring?: boolean
  isAuthenticated?: boolean
}

type State =
  | { status: "loading" }
  | { status: "no_data" }
  | { status: "ready"; score: ScoringOutput; recommendations: Recommendation[] }

export default function ResultsClient({ opportunities, needsScoring = false, isAuthenticated = false }: Props) {
  const [state, setState] = useState<State>({ status: "loading" })
  const [showFavorites, setShowFavorites] = useState(false)
  const { isSaved } = useSavedOpportunities()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      try {
        let score: ScoringOutput | null = null
        let answers: Record<string, string> | null = null

        // Always read current session answers first
        const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION)
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw) as {
            state?: { answers?: Record<string, string> }
            answers?: Record<string, string>
          }
          // Zustand persist wraps state as { state: { answers }, version }
          answers = session.state?.answers ?? session.answers ?? null
        }

        // Use cache only if not forced to re-score and answers haven't changed
        if (!needsScoring && answers) {
          const cached = localStorage.getItem(STORAGE_KEY_RESULT)
          if (cached) {
            const parsed = JSON.parse(cached) as {
              score: ScoringOutput
              answers?: Record<string, string>
            }
            if (parsed.answers && answersMatch(parsed.answers, answers)) {
              score = parsed.score
            }
          }
        }

        if (!score && answers && Object.keys(answers).length > 0) {
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

        // Clean up the needs_scoring param after processing
        if (needsScoring) {
          router.replace("/results")
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

        if (isAuthenticated) {
          try {
            fetch("/api/user/save-test-response", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers }),
            })
          } catch {}
        }

        posthog.capture("results_viewed", {
          recommendations_count: recommendations.length,
          segment: score.segment,
          global_score: score.global_score,
        })

        setState({ status: "ready", score, recommendations })
      } catch {
        setState({ status: "no_data" })
      }
    }

    load()
  }, [opportunities, needsScoring, router, isAuthenticated])

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

  const capped = recommendations.slice(0, MAX_RESULTS)
  const free = isAuthenticated ? capped : []
  const locked = isAuthenticated ? [] : capped

  const savedCount = free.filter((rec) => isSaved(rec.opportunity.id)).length

  const displayedFree = showFavorites
    ? free.filter((rec) => isSaved(rec.opportunity.id))
    : free

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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-dark">
                Tes recommandations
              </h2>
              {savedCount > 0 && (
                <button
                  onClick={() => setShowFavorites((v) => !v)}
                  className={[
                    "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold transition-colors",
                    showFavorites
                      ? "bg-primary text-white"
                      : "bg-orange-50 text-primary hover:bg-orange-100",
                  ].join(" ")}
                >
                  <Bookmark className="w-3 h-3" fill={showFavorites ? "currentColor" : "none"} />
                  Mes favoris ({savedCount})
                </button>
              )}
            </div>
            <div className="space-y-3">
              {displayedFree.length === 0 && showFavorites ? (
                <p className="text-sm text-slate-mid text-center py-4">
                  Aucune opportunité sauvegardée pour ce profil.
                </p>
              ) : (
                displayedFree.map((rec, i) => (
                  <RecommendationCard
                    key={rec.opportunity.id}
                    recommendation={rec}
                    rank={i + 1}
                  />
                ))
              )}
            </div>
          </div>

          {isAuthenticated && free.length > 0 && !showFavorites && (
            <CoachingUpsell recommendations={free} />
          )}

          {locked.length > 0 && <PaywallSection locked={locked} totalCount={capped.length} isAuthenticated={isAuthenticated} />}
        </>
      )}
    </div>
  )
}
