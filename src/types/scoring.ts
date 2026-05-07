import type { TestAnswers } from "./test"

export type Segment = "Explorer" | "Candidat" | "Finaliste"

const PAYLOAD_LEVEL_MAP: Record<string, string> = {
  bac3: "licence",
  bac5: "master",
}

export function normalizeStudyLevel(payloadLevel: string): string {
  return PAYLOAD_LEVEL_MAP[payloadLevel] ?? payloadLevel
}

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
  location?: string | null
  funding_type: string
  deadline: string | null
  budget_required: number | null
  short_description?: string | null
  source_url?: string | null
  eligibility_summary?: string | null
}

export type RecommendationBadge = "top" | "probability" | null

export type FeasibilityFinancial = "ok" | "risque" | "bloquant"
export type FeasibilityAcademic = "ok" | "limite"
export type FeasibilityTemporal = "urgent" | "confortable"

export interface FeasibilityScore {
  financial: FeasibilityFinancial
  academic: FeasibilityAcademic
  temporal: FeasibilityTemporal
}

export interface Recommendation {
  opportunity: Opportunity
  match_score: number
  justification: string
  badge: RecommendationBadge
  isExpired: boolean
  feasibility: FeasibilityScore
}

export interface MatchInput {
  score: ScoringOutput
  answers: TestAnswers
  opportunities: Opportunity[]
}
