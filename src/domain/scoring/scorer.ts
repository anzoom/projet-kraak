import type { TestAnswers } from "@/types/test"
import type { ScoringOutput, Segment } from "@/types/scoring"
import { SCORING_RULES } from "./rules"

function lookup(map: Record<string, number>, key: string): number {
  return map[key] ?? 0
}

export function computeScore(answers: TestAnswers): ScoringOutput {
  const academic_score =
    (lookup(SCORING_RULES.current_level, answers.current_level) +
      lookup(SCORING_RULES.academic_level, answers.academic_level)) /
    2

  const financial_score = lookup(SCORING_RULES.budget, answers.budget)

  const maturity_score =
    lookup(SCORING_RULES.dossier_maturity, answers.dossier_maturity) * 0.55 +
    lookup(SCORING_RULES.timeline, answers.timeline) * 0.30 +
    lookup(SCORING_RULES.main_blocker, answers.main_blocker) * 0.15

  const global_score =
    academic_score * 0.35 + financial_score * 0.25 + maturity_score * 0.40

  const segment: Segment =
    global_score >= 70 ? "Finaliste" : global_score >= 40 ? "Candidat" : "Explorer"

  return { academic_score, financial_score, maturity_score, global_score, segment }
}
