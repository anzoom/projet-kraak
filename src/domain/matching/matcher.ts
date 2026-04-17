import type { MatchInput, Recommendation, Opportunity } from "@/types/scoring"
import { SCORING_RULES } from "@/domain/scoring/rules"

const MATCH_BONUS = {
  category: 30,
  domain: 25,
  country: 20,
  complete_funding: 15,
  deadline_soon: 10,
} as const

const BUDGET_PENALTY = 30
const DEADLINE_WINDOW_DAYS = 90

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function isStudyLevelCompatible(oppLevel: string, userLevel: string): boolean {
  if (oppLevel === "tous") return true
  return oppLevel === userLevel
}

function isDeadlineSoon(deadline: string): boolean {
  const now = Date.now()
  const d = new Date(deadline).getTime()
  const windowMs = DEADLINE_WINDOW_DAYS * 24 * 60 * 60 * 1000
  return d > now && d <= now + windowMs
}

function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

function scoreOpportunity(
  opp: Opportunity,
  answers: MatchInput["answers"],
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  if (normalize(opp.category) === normalize(answers.main_objective ?? "")) {
    score += MATCH_BONUS.category
    reasons.push("catégorie correspond à ton objectif")
  }

  if (
    answers.domain &&
    normalize(opp.domain).includes(normalize(answers.domain))
  ) {
    score += MATCH_BONUS.domain
    reasons.push("domaine correspond à ta filière")
  }

  const targetCountry = answers.target_country ?? ""
  if (targetCountry === "peu_importe") {
    if (opp.funding_type === "complete") {
      score += MATCH_BONUS.country
      reasons.push("financement complet (pays flexible)")
    }
  } else if (normalize(opp.country) === normalize(targetCountry)) {
    score += MATCH_BONUS.country
    reasons.push("pays cible correspond")
  }

  if (opp.funding_type === "complete" && answers.budget === "zero") {
    score += MATCH_BONUS.complete_funding
    reasons.push("financement complet disponible sans apport")
  }

  if (opp.deadline && isDeadlineSoon(opp.deadline)) {
    score += MATCH_BONUS.deadline_soon
    reasons.push("deadline dans les 90 prochains jours")
  }

  const budgetMax = SCORING_RULES.budget_max_xof[answers.budget ?? ""] ?? 0
  if (opp.budget_required !== null && opp.budget_required > budgetMax) {
    score -= BUDGET_PENALTY
    reasons.push("budget requis dépasse ton budget estimé (-30)")
  }

  return { score, reasons }
}

export function matchOpportunities(input: MatchInput): Recommendation[] {
  const { answers, opportunities } = input

  const recommendations: Recommendation[] = []

  for (const opp of opportunities) {
    if (!opp.is_active) continue
    if (!isStudyLevelCompatible(opp.study_level, answers.academic_level ?? "")) continue
    if (opp.deadline && isDeadlinePassed(opp.deadline)) continue

    const { score, reasons } = scoreOpportunity(opp, answers)

    const justification =
      reasons.length > 0
        ? reasons.slice(0, 3).join(", ")
        : "aucun critère de correspondance fort"

    recommendations.push({ opportunity: opp, match_score: score, justification })
  }

  return recommendations.sort((a, b) => b.match_score - a.match_score)
}
