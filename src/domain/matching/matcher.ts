import type { MatchInput, Recommendation, RecommendationBadge, Opportunity, FeasibilityScore } from "@/types/scoring"
import { SCORING_RULES } from "@/domain/scoring/rules"
import { getZoneForCountry, isSpecificCountry } from "@/lib/countries"

const MATCH_BONUS = {
  category: 30,
  domain: 20,
  country: 20,
  country_zone_fallback: 8,  // zone-wide opp when user wants a specific country
  country_international: 5,  // international opp — always passes but least precise
  complete_funding_zero: 20, // financement complet pour profil sans budget
  complete_funding_any: 10,  // financement complet quel que soit le budget
  deadline_soon: 10,
} as const

const DEADLINE_SOON_DAYS = 90

// Fenêtre max (en jours) selon l'horizon déclaré par l'utilisateur
const TIMELINE_MAX_DAYS: Record<string, number> = {
  urgent: 90,
  court: 180,
  moyen: 365,
  long: Infinity,
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
}

// ── Filtres durs ────────────────────────────────────────────────────────────

// Level order: bac < bac2 < bac3 < bac5 < doctorat
// oppLevel = niveau minimum requis ; l'utilisateur doit être >= ce niveau
const LEVEL_RANK: Record<string, number> = { bac: 0, bac2: 1, licence: 2, bac3: 2, master: 3, bac5: 3, doctorat: 4 }

function isStudyLevelCompatible(oppLevel: string, userLevel: string): boolean {
  if (oppLevel === "tous") return true
  const oppRank = LEVEL_RANK[oppLevel]
  const userRank = LEVEL_RANK[userLevel]
  if (oppRank === undefined || userRank === undefined) return oppLevel === userLevel
  return userRank >= oppRank
}

function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

/** Exclut les opportunités dont la deadline dépasse l'horizon de l'utilisateur.
 *  Une deadline null (programme permanent) passe toujours. */
function isTimelineCompatible(deadline: string | null, timeline: string): boolean {
  if (!deadline) return true
  const maxDays = TIMELINE_MAX_DAYS[timeline] ?? Infinity
  if (maxDays === Infinity) return true
  const daysUntil = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return daysUntil <= maxDays
}

/**
 * Filtre zone/pays géographique — hiérarchique :
 *  - `peu_importe` → tout passe
 *  - opportunité `international` → passe toujours
 *  - correspondance exacte (ex: france === france, europe === europe)
 *  - utilisateur choisit un pays précis (ex: france) → les oppos de la zone entière (europe) passent aussi
 *  - utilisateur choisit une zone (ex: europe) → les oppos d'un pays de cette zone (france) passent aussi
 */
function isCountryCompatible(oppCountry: string, targetCountry: string): boolean {
  if (!targetCountry || targetCountry === "peu_importe") return true
  const opp = normalize(oppCountry)
  const target = normalize(targetCountry)
  if (opp === "international") return true
  if (opp === target) return true
  // Oppo couvre toute une zone, l'utilisateur veut un pays précis dans cette zone
  const targetZone = getZoneForCountry(target)
  if (targetZone && opp === targetZone) return true
  // Oppo est dans un pays précis, l'utilisateur veut n'importe quel pays de cette zone
  const oppZone = getZoneForCountry(opp)
  if (oppZone && oppZone === target) return true
  return false
}

// ── Scoring (ranking des résultats filtrés) ─────────────────────────────────

function isDeadlineSoon(deadline: string): boolean {
  const now = Date.now()
  const d = new Date(deadline).getTime()
  const windowMs = DEADLINE_SOON_DAYS * 24 * 60 * 60 * 1000
  return d > now && d <= now + windowMs
}

function scoreOpportunity(
  opp: Opportunity,
  answers: MatchInput["answers"],
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Catégorie — toujours vraie après filtre dur (+30 garanti)
  score += MATCH_BONUS.category
  reasons.push("catégorie correspond à ton objectif")

  // Domaine — toujours vrai après filtre dur (+20 garanti si domaine renseigné)
  if (answers.domain) {
    score += MATCH_BONUS.domain
    reasons.push("domaine correspond à ta filière")
  }

  // Pays/Zone — scoring différencié selon la précision du match
  const targetCountry = answers.target_country ?? ""
  if (targetCountry === "peu_importe") {
    if (opp.funding_type === "complete") {
      score += MATCH_BONUS.country
      reasons.push("financement complet (pays flexible)")
    }
  } else {
    const oppNorm = normalize(opp.country)
    const targetNorm = normalize(targetCountry)

    if (oppNorm === targetNorm) {
      // Correspondance exacte pays/zone
      score += MATCH_BONUS.country
      reasons.push("pays cible correspond")
    } else if (oppNorm === "international") {
      // Opportunité mondiale — passe le filtre mais moins précise qu'un pays exact
      score += MATCH_BONUS.country_international
      reasons.push("ouvert à l'international")
    } else {
      const targetZone = getZoneForCountry(targetNorm)
      const oppZone = getZoneForCountry(oppNorm)

      if (oppZone && oppZone === targetNorm) {
        // Oppo dans un pays précis, utilisateur veut toute la zone → match fort
        score += MATCH_BONUS.country
        reasons.push("pays dans la zone cible")
      } else if (targetZone && oppNorm === targetZone) {
        // Oppo couvre toute la zone, utilisateur veut un pays précis → match partiel
        score += MATCH_BONUS.country_zone_fallback
        reasons.push("zone géographique compatible")
      }
    }
  }

  // Financement complet — priorité africaine
  if (opp.funding_type === "complete") {
    if (answers.budget === "zero") {
      score += MATCH_BONUS.complete_funding_zero
      reasons.push("financement 100% disponible — aucun apport requis")
    } else {
      score += MATCH_BONUS.complete_funding_any
      reasons.push("opportunité entièrement financée")
    }
  }

  // Deadline dans les 90 prochains jours
  if (opp.deadline && isDeadlineSoon(opp.deadline)) {
    score += MATCH_BONUS.deadline_soon
    reasons.push("deadline dans les 90 prochains jours")
  }

  return { score, reasons }
}

// ── Rang de précision géographique (pour le tri en deux niveaux) ─────────────
// Garantit que les oppos exactement dans le pays cible précèdent toujours les
// oppos de zone, elles-mêmes avant les oppos internationales — indépendamment
// des bonus secondaires (financement complet, deadline proche, etc.).

function getCountryRank(oppCountry: string, targetCountry: string): number {
  if (!targetCountry || targetCountry === "peu_importe") return 0
  const opp = normalize(oppCountry)
  const target = normalize(targetCountry)
  if (opp === target) return 3
  if (opp === "international") return 1
  const targetZone = getZoneForCountry(target)
  const oppZone = getZoneForCountry(opp)
  if (oppZone && oppZone === target) return 3   // pays dans la zone → exact pour une recherche zone
  if (targetZone && opp === targetZone) return 2 // zone couvre le pays cible → fallback
  return 0
}

// ── Score de faisabilité ────────────────────────────────────────────────────

function computeFeasibility(
  opp: Opportunity,
  answers: MatchInput["answers"],
  budgetMax: number,
): FeasibilityScore {
  let financial: FeasibilityScore["financial"] = "ok"
  if (opp.funding_type !== "complete" && answers.budget === "zero") {
    financial = "bloquant"
  } else if (opp.budget_required !== null && opp.budget_required > budgetMax * 0.5) {
    financial = "risque"
  }

  const oppRank = LEVEL_RANK[opp.study_level] ?? 0
  const userRank = LEVEL_RANK[answers.academic_level ?? "bac"] ?? 0
  const academic: FeasibilityScore["academic"] = (oppRank - userRank) <= 1 ? "ok" : "limite"

  let temporal: FeasibilityScore["temporal"] = "confortable"
  if (opp.deadline) {
    const daysUntil = (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    if (daysUntil < 30) temporal = "urgent"
  }

  return { financial, academic, temporal }
}

function buildEnrichedJustification(
  opp: Opportunity,
  answers: MatchInput["answers"],
  feasibility: FeasibilityScore,
  reasons: string[],
): string {
  const parts: string[] = []

  if (feasibility.financial === "ok" && opp.funding_type === "complete" && answers.budget === "zero") {
    parts.push("✅ Financement intégral — aucun apport de ta part")
  } else if (reasons.some((r) => r.includes("pays cible correspond") || r.includes("pays dans la zone cible"))) {
    const countryLabel = opp.country.charAt(0).toUpperCase() + opp.country.slice(1).replace(/_/g, " ")
    parts.push(`✅ Opportunité en ${countryLabel}, ta zone cible`)
  }

  if (answers.academic_level) {
    if (feasibility.academic === "ok") {
      parts.push(`✅ Ton niveau est compatible`)
    } else {
      parts.push("⚡ Niveau limite — un dossier solide peut compenser")
    }
  }

  if (feasibility.temporal === "urgent") {
    parts.push("⏰ Deadline proche — candidate rapidement")
  } else if (answers.domain && answers.domain !== "autre" && opp.funding_type === "complete" && answers.budget !== "zero") {
    parts.push("✅ Opportunité entièrement financée")
  } else if (answers.domain && answers.domain !== "autre") {
    parts.push("✅ Domaine correspondant à ta filière")
  }

  if (parts.length > 0) return parts.slice(0, 3).join(" · ")
  return reasons.slice(0, 2).join(", ") || "opportunité correspondant à ton profil"
}

// ── Point d'entrée ──────────────────────────────────────────────────────────

export function matchOpportunities(input: MatchInput): Recommendation[] {
  const { answers, opportunities } = input

  const budgetMax = SCORING_RULES.budget_max_xof[answers.budget ?? ""] ?? 0
  const timeline = answers.timeline ?? "long"
  const targetCountry = answers.target_country ?? ""

  // Horizons pour lesquels les éditions passées sont pertinentes (≥ 6 mois)
  const EXPIRED_ELIGIBLE_TIMELINES = new Set(["moyen", "long"])
  const showExpired = EXPIRED_ELIGIBLE_TIMELINES.has(timeline)

  const active: Recommendation[] = []
  const expired: Recommendation[] = []

  for (const opp of opportunities) {
    // Filtre 1 — opportunité active
    if (!opp.is_active) continue

    const isExpired = !!(opp.deadline && isDeadlinePassed(opp.deadline))

    // Filtre 2 — deadline expirée : exclure si l'horizon est trop court
    if (isExpired && !showExpired) continue

    // Filtre 3 — niveau d'étude compatible avec le dernier diplôme
    if (!isStudyLevelCompatible(opp.study_level, answers.academic_level ?? "")) continue

    // Filtre 4 — catégorie = objectif principal ("autre" = pas de préférence → tout passe)
    if (answers.main_objective && answers.main_objective !== "autre") {
      if (normalize(opp.category) !== normalize(answers.main_objective)) continue
    }

    // Filtre 5 — domaine (si renseigné) ; multidisciplinaire et "autre" passent toujours
    const oppDomain = normalize(opp.domain)
    if (answers.domain && answers.domain !== "autre" && oppDomain !== "multidisciplinaire" && oppDomain !== normalize(answers.domain)) continue

    // Filtre 6 — pays / région cible (hiérarchique)
    if (!isCountryCompatible(opp.country, targetCountry)) continue

    // Filtre 7 — budget : exclure si le budget requis dépasse le budget déclaré
    if (opp.budget_required !== null && opp.budget_required > budgetMax) continue

    // Filtre 7bis — budget zéro : uniquement les opportunités entièrement financées
    if (answers.budget === "zero" && opp.funding_type !== "complete") continue

    // Filtre 8 — horizon de départ compatible avec la deadline (actives seulement)
    if (!isExpired && !isTimelineCompatible(opp.deadline, timeline)) continue

    const { score, reasons } = scoreOpportunity(opp, answers)
    const feasibility = computeFeasibility(opp, answers, budgetMax)

    const rec: Recommendation = {
      opportunity: opp,
      match_score: score,
      justification: buildEnrichedJustification(opp, answers, feasibility, reasons),
      badge: null,
      isExpired,
      feasibility,
    }

    if (isExpired) expired.push(rec)
    else active.push(rec)
  }

  // Tri en deux niveaux : précision pays d'abord, score ensuite
  const sortedActive = active.sort((a, b) => {
    const rankDiff = getCountryRank(b.opportunity.country, targetCountry)
                   - getCountryRank(a.opportunity.country, targetCountry)
    return rankDiff !== 0 ? rankDiff : b.match_score - a.match_score
  })
  const sortedExpired = expired.sort((a, b) => {
    const rankDiff = getCountryRank(b.opportunity.country, targetCountry)
                   - getCountryRank(a.opportunity.country, targetCountry)
    return rankDiff !== 0 ? rankDiff : b.match_score - a.match_score
  })

  const strongProfile =
    ["avance", "pret"].includes(answers.dossier_maturity ?? "") &&
    ["licence", "master", "doctorat"].includes(answers.academic_level ?? "")

  const withBadges = sortedActive.map((rec, i) => {
    let badge: RecommendationBadge = null
    if (i < 2) badge = "top"
    else if (strongProfile && i < 4) badge = "probability"
    return { ...rec, badge }
  })

  return [...withBadges, ...sortedExpired]
}

/** Retourne le nombre de recommandations matchées via zone et non via pays exact.
 *  Utilisé dans ResultsClient pour afficher un message informatif. */
export function countZoneFallbacks(
  recommendations: Recommendation[],
  targetCountry: string,
): number {
  if (!isSpecificCountry(targetCountry)) return 0
  return recommendations.filter((r) => {
    const c = normalize(r.opportunity.country)
    return c !== normalize(targetCountry) && c !== "international"
  }).length
}
