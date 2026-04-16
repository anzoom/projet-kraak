// TODO — Étape 2 : UserProfileScore + Opportunities → Recommendation[]
// Filtre, trie et justifie les recommandations

export type MatchInput = {
  score: {
    academic_score: number
    financial_score: number
    maturity_score: number
    segment: string
  }
  opportunities: Array<Record<string, unknown>>
}

export type Recommendation = {
  opportunity_id: string
  match_score: number
  justification: string
}

export function matchOpportunities(_input: MatchInput): Recommendation[] {
  throw new Error("Not implemented — voir Étape 2")
}
