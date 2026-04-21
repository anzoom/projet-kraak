import type { MatchInput, Recommendation, RecommendationBadge, Opportunity } from "@/types/scoring"
import { SCORING_RULES } from "@/domain/scoring/rules"

const MATCH_BONUS = {
  category: 30,
  domain: 25,
  country: 20,
  complete_funding: 15,
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
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

// ── Filtres durs ────────────────────────────────────────────────────────────

function isStudyLevelCompatible(oppLevel: string, userLevel: string): boolean {
  if (oppLevel === "tous") return true
  return oppLevel === userLevel
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

/** Filtre pays :
 *  - `peu_importe` → aucun filtre
 *  - `afrique` → l'opportunité doit être localisée en Afrique (`country = "afrique"`)
 *  - valeur spécifique → correspondance exacte */
function isCountryCompatible(oppCountry: string, targetCountry: string): boolean {
  if (!targetCountry || targetCountry === "peu_importe") return true
  return normalize(oppCountry) === normalize(targetCountry)
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

  // Domaine — toujours vrai après filtre dur (+25 garanti si domaine renseigné)
  if (answers.domain) {
    score += MATCH_BONUS.domain
    reasons.push("domaine correspond à ta filière")
  }

  // Pays — toujours vrai après filtre dur (+20 garanti sauf peu_importe sans complet)
  const targetCountry = answers.target_country ?? ""
  if (targetCountry === "peu_importe") {
    if (opp.funding_type === "complete") {
      score += MATCH_BONUS.country
      reasons.push("financement complet (pays flexible)")
    }
  } else {
    score += MATCH_BONUS.country
    reasons.push("pays cible correspond")
  }

  // Financement complet sans apport
  if (opp.funding_type === "complete" && answers.budget === "zero") {
    score += MATCH_BONUS.complete_funding
    reasons.push("financement complet disponible sans apport")
  }

  // Deadline dans les 90 prochains jours
  if (opp.deadline && isDeadlineSoon(opp.deadline)) {
    score += MATCH_BONUS.deadline_soon
    reasons.push("deadline dans les 90 prochains jours")
  }

  return { score, reasons }
}

// ── Point d'entrée ──────────────────────────────────────────────────────────

export function matchOpportunities(input: MatchInput): Recommendation[] {
  const { answers, opportunities } = input

  const budgetMax = SCORING_RULES.budget_max_xof[answers.budget ?? ""] ?? 0
  const timeline = answers.timeline ?? "long"

  const recommendations: Recommendation[] = []

  for (const opp of opportunities) {
    // Filtre 1 — opportunité active
    if (!opp.is_active) continue

    // Filtre 2 — deadline non expirée
    if (opp.deadline && isDeadlinePassed(opp.deadline)) continue

    // Filtre 3 — niveau d'étude compatible avec le dernier diplôme
    if (!isStudyLevelCompatible(opp.study_level, answers.academic_level ?? "")) continue

    // Filtre 4 — catégorie = objectif principal
    if (normalize(opp.category) !== normalize(answers.main_objective ?? "")) continue

    // Filtre 5 — domaine (si renseigné)
    if (answers.domain && normalize(opp.domain) !== normalize(answers.domain)) continue

    // Filtre 6 — pays / région cible
    if (!isCountryCompatible(opp.country, answers.target_country ?? "")) continue

    // Filtre 7 — budget : exclure si le budget requis dépasse le budget déclaré
    if (opp.budget_required !== null && opp.budget_required > budgetMax) continue

    // Filtre 8 — horizon de départ compatible avec la deadline
    if (!isTimelineCompatible(opp.deadline, timeline)) continue

    const { score, reasons } = scoreOpportunity(opp, answers)

    recommendations.push({
      opportunity: opp,
      match_score: score,
      justification: reasons.length > 0
        ? reasons.slice(0, 3).join(", ")
        : "aucun critère de correspondance fort",
      badge: null,
    })
  }

  const sorted = recommendations.sort((a, b) => b.match_score - a.match_score)

  const strongProfile =
    ["avance", "pret"].includes(answers.dossier_maturity ?? "") &&
    ["licence", "master", "doctorat"].includes(answers.academic_level ?? "")

  return sorted.map((rec, i) => {
    let badge: RecommendationBadge = null
    if (i < 2) badge = "top"
    else if (strongProfile && i < 4) badge = "probability"
    return { ...rec, badge }
  })
}
