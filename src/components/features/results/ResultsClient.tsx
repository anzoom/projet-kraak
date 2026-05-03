"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Lock } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import type { ScoringOutput, Opportunity, Recommendation } from "@/types/scoring"
import { matchOpportunities, countZoneFallbacks } from "@/domain/matching/matcher"
import { SPECIFIC_COUNTRIES, ZONE_LABELS, ZONE_ARTICLES, getZoneForCountry, withA, toute } from "@/lib/countries"
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities"
import ScoreCard from "./ScoreCard"
import RecommendationCard from "./RecommendationCard"
import PaywallSection from "./PaywallSection"
import CoachingUpsell from "./CoachingUpsell"
import BetaCapture from "@/components/features/waitlist/BetaCapture"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"
const STORAGE_KEY_RESULT = "kraak_scoring_result"
const STORAGE_KEY_QUOTA = "kraak_free_quota_ids"
const MAX_FREE = 5       // quota classic
const MAX_PREMIUM = 20   // quota premium (anti-scraping : saves cap = 15)

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
  maxResults?: number
}

type State =
  | { status: "loading" }
  | { status: "no_data" }
  | { status: "ready"; score: ScoringOutput; answers: Record<string, string>; recommendations: Recommendation[]; quotaExhausted: boolean }

export default function ResultsClient({ opportunities, needsScoring = false, isAuthenticated = false, maxResults = MAX_FREE }: Props) {
  const [state, setState] = useState<State>({ status: "loading" })
  const [showFavorites, setShowFavorites] = useState(false)
  const isPremium = false // Phase MVP : pas d'accès premium actif
  const limit = maxResults // MAX_PREMIUM utilisé quand isPremium sera actif
  const { savedIds, isSaved, toggle, count: savedCount, limitReached, maxSaved } = useSavedOpportunities({ isPremium, isAuthenticated })
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

        const allRecommendations = matchOpportunities({
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

        // Gestion du quota d'opportunités : les IDs sont fixés dès la première consultation
        const storedQuota = localStorage.getItem(STORAGE_KEY_QUOTA)
        let quotaIds: string[] = storedQuota ? (JSON.parse(storedQuota) as string[]) : []
        let quotaExhausted = false

        if (quotaIds.length === 0) {
          // Premier accès : fixer le quota à partir des premières recommandations
          quotaIds = allRecommendations.slice(0, limit).map((r) => r.opportunity.id)
          if (quotaIds.length > 0) {
            localStorage.setItem(STORAGE_KEY_QUOTA, JSON.stringify(quotaIds))
          }
        } else {
          // Quota déjà fixé : vérifier si les nouvelles recs contiennent les mêmes IDs
          const newIds = allRecommendations.slice(0, limit).map((r) => r.opportunity.id)
          const isNewSet = newIds.some((id) => !quotaIds.includes(id))
          if (isNewSet) {
            // L'utilisateur tente de voir de nouvelles oppos via les critères → quota épuisé
            quotaExhausted = true
          }
        }

        // Reconstruire les recommandations à partir du quota fixé
        const quotaRecs = quotaIds
          .map((id) => allRecommendations.find((r) => r.opportunity.id === id) ??
            // Si l'oppo du quota n'est plus dans les nouvelles recs, la retrouver dans toutes les opportunités
            (() => {
              const opp = opportunities.find((o) => o.id === id)
              if (!opp) return null
              return {
                opportunity: opp,
                match_score: 0,
                justification: "dans ton quota d'accès gratuit",
                badge: null,
                isExpired: !!(opp.deadline && new Date(opp.deadline) < new Date()),
              } satisfies Recommendation
            })()
          )
          .filter((r): r is Recommendation => r !== null)

        posthog.capture("results_viewed", {
          recommendations_count: allRecommendations.length,
          segment: score.segment,
          global_score: score.global_score,
          quota_exhausted: quotaExhausted,
        })

        setState({ status: "ready", score, answers, recommendations: quotaRecs, quotaExhausted })
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

  const { score, answers, recommendations, quotaExhausted } = state

  // Message informatif quand des opportunités zone-wide complètent le matching d'un pays précis
  const targetCountry = answers.target_country ?? ""
  const zoneFallbackCount = countZoneFallbacks(recommendations, targetCountry)
  const targetCountryMeta = SPECIFIC_COUNTRIES[targetCountry]
  const targetCountryLabel = targetCountryMeta?.label ?? ""
  const targetZone = getZoneForCountry(targetCountry) ?? ""
  const targetZoneLabel = ZONE_LABELS[targetZone] ?? ""
  const zoneArticle = ZONE_ARTICLES[targetZone] ?? "l'"
  const countryArticle = targetCountryMeta?.article ?? "la"

  // Les recommandations sont déjà limitées au quota dans la logique de load()
  const capped = recommendations
  const free = isAuthenticated ? capped : []
  const locked = isAuthenticated ? [] : capped

  // En mode favoris : affiche TOUTES les opportunités sauvegardées (y compris hors recommandations)
  const favoriteOpportunities = opportunities.filter((o) => savedIds.includes(o.id))
  const favoriteRecs: Recommendation[] = favoriteOpportunities.map((o) => {
    const existing = free.find((r) => r.opportunity.id === o.id)
    if (existing) return existing
    return {
      opportunity: o,
      match_score: 0,
      justification: "",
      badge: null,
      isExpired: !!(o.deadline && new Date(o.deadline) < new Date()),
    } satisfies Recommendation
  })

  const displayedFree = showFavorites ? favoriteRecs : free

  return (
    <div className="w-full max-w-lg space-y-6">
      <ScoreCard score={score} />

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4">
          <div className="text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-slate-dark font-semibold mb-1">
              Aucune opportunité trouvée pour ce profil
            </p>
            <p className="text-slate-mid text-sm leading-relaxed">
              Nous n&apos;avons pas repéré d&apos;opportunité correspondant à tes critères dans notre catalogue actuel.
              On travaille à l&apos;élargir — et c&apos;est là que tu peux nous aider.
            </p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-slate-dark mb-1">
              Tu as repéré une opportunité qu&apos;on n&apos;a pas encore ?
            </p>
            <p className="text-xs text-slate-mid leading-relaxed mb-3">
              Partage-la nous — on l&apos;étudie, on l&apos;enrichit et on l&apos;ajoute au catalogue pour en faire profiter tous les utilisateurs.
            </p>
            <a
              href={`mailto:hello@kraak.co?subject=Opportunité%20à%20ajouter%20au%20catalogue&body=Bonjour%2C%0A%0AJ%27ai%20repéré%20une%20opportunité%20qui%20pourrait%20intéresser%20d%27autres%20utilisateurs%20KRAAK%20%3A%0A%0A-%20Nom%20%2F%20titre%20%3A%0A-%20Lien%20officiel%20%3A%0A-%20Type%20(bourse%2C%20fellowship%2C%20programme…)%20%3A%0A-%20Niveau%20requis%20%3A%0A-%20Zone%20géographique%20%3A%0A%0AMerci%20!`}
              className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold text-xs px-4 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
            >
              ✉️ Suggérer une opportunité →
            </a>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-dark">
                Tes recommandations
              </h2>
              {isPremium && savedCount > 0 && (
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
                  Mes favoris ({savedCount}/{maxSaved})
                </button>
              )}
              {limitReached && (
                <span className="text-xs text-red-500 font-medium">
                  Limite de {maxSaved} favoris atteinte
                </span>
              )}
            </div>
            <div className="space-y-3">
              {displayedFree.length === 0 && showFavorites ? (
                <p className="text-sm text-slate-mid text-center py-4">
                  Aucune opportunité sauvegardée.
                </p>
              ) : (
                displayedFree.map((rec, i) => (
                  <div key={rec.opportunity.id}>
                    <RecommendationCard
                      recommendation={rec}
                      rank={i + 1}
                      saved={isSaved(rec.opportunity.id)}
                      onToggle={toggle}
                      isPremium={isPremium}
                    />

                    {/* CoachingUpsell interstitiel après la 3ème reco */}
                    {i === 2 && !showFavorites && (
                      <div className="mt-3">
                        <CoachingUpsell recommendations={free.length > 0 ? free : capped} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Upgrade teaser Classic → Premium */}
            {!isPremium && !showFavorites && isAuthenticated && (
              <div className="mt-3 bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">🚀</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-dark mb-1">
                    Passe en Premium — vois 4× plus
                  </p>
                  <p className="text-xs text-slate-mid leading-relaxed mb-3">
                    Compte Classic : <strong>jusqu'à 5 recommandations</strong>. Guide Premium : <strong>jusqu'à 20 recommandations</strong> + 15 favoris sauvegardables.
                  </p>
                  <Link
                    href="/guide-premium"
                    className="inline-flex items-center h-8 px-4 rounded-full border-2 border-primary text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
                  >
                    Découvrir le Guide Premium →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bandeau zone-fallback — opportunités zone-wide incluses pour compléter le pays précis */}
          {zoneFallbackCount > 0 && !showFavorites && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">ℹ️</span>
              <p className="text-xs text-blue-800 leading-relaxed">
                {zoneFallbackCount === 1
                  ? `1 opportunité est ouverte ${toute(zoneArticle, targetZoneLabel)}, pas uniquement ${withA(countryArticle, targetCountryLabel)}.`
                  : `${zoneFallbackCount} opportunités sont ouvertes ${toute(zoneArticle, targetZoneLabel)}, pas uniquement ${withA(countryArticle, targetCountryLabel)}.`}{" "}
                Elles restent accessibles depuis {targetCountryLabel} — on les inclut pour compléter tes résultats.
              </p>
            </div>
          )}

          {/* Alerte quota épuisé — modifications des critères bloquées */}
          {quotaExhausted && !showFavorites && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-dark text-sm mb-1">
                    Quota gratuit atteint (jusqu'à {limit} opportunités)
                  </p>
                  <p className="text-xs text-slate-mid leading-relaxed mb-3">
                    Tu as déjà consulté tes {limit} opportunités gratuites. Modifier les critères ne débloque pas de nouvelles recommandations — ces résultats sont ceux qui t&apos;ont été attribués.
                  </p>
                  <Link
                    href="/guide-premium"
                    className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold text-xs px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
                  >
                    Voir toutes mes opportunités →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Collecte d'intérêt services à venir */}
          {!showFavorites && (
            <BetaCapture
              source="results"
              title="Services à venir"
              subtitle="Dis-nous ce qui t'intéresse — on te prévient en premier."
              ctaLabel="Me prévenir →"
            />
          )}

          {locked.length > 0 && <PaywallSection locked={locked} totalCount={capped.length} isAuthenticated={isAuthenticated} />}

          {/* Coconstruction — toujours visible en bas des résultats */}
          {!showFavorites && (
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100">
              <span className="text-lg shrink-0 mt-0.5">🤝</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-dark mb-0.5">
                  Tu as repéré une opportunité qu&apos;on n&apos;a pas encore ?
                </p>
                <p className="text-xs text-slate-mid leading-relaxed mb-2">
                  Partage-la nous — on l&apos;enrichit et on l&apos;ajoute au catalogue pour toute la communauté.
                </p>
                <a
                  href={`mailto:hello@kraak.co?subject=Opportunité%20à%20ajouter%20au%20catalogue&body=Bonjour%2C%0A%0AJ%27ai%20repéré%20une%20opportunité%20qui%20pourrait%20intéresser%20d%27autres%20utilisateurs%20KRAAK%20%3A%0A%0A-%20Nom%20%2F%20titre%20%3A%0A-%20Lien%20officiel%20%3A%0A-%20Type%20(bourse%2C%20fellowship%2C%20programme…)%20%3A%0A-%20Niveau%20requis%20%3A%0A-%20Zone%20géographique%20%3A%0A%0AMerci%20!`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  ✉️ Suggérer une opportunité →
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
