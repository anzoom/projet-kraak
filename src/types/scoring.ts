import type { TestAnswers } from "./test"

export type Segment = "Explorer" | "Candidat" | "Finaliste"

export interface ScoringOutput {
  academic_score: number
  financial_score: number
  maturity_score: number
  global_score: number
  segment: Segment
}

export interface Opportunity {
  id: string
  title: string
  is_active: boolean
  study_level: string
  category: string
  domain: string
  country: string
  funding_type: string
  deadline: string | null
  budget_required: number | null
}

export interface Recommendation {
  opportunity: Opportunity
  match_score: number
  justification: string
}

export interface MatchInput {
  score: ScoringOutput
  answers: TestAnswers
  opportunities: Opportunity[]
}
