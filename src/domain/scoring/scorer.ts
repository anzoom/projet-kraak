// TODO — Étape 2 : TestResponse → UserProfileScore
// Fonction pure TypeScript sans dépendance framework
// Déterministe : même entrée → même sortie

export type ScoringInput = {
  answers: Record<string, unknown>
}

export type ScoringOutput = {
  academic_score: number
  financial_score: number
  maturity_score: number
  segment: string
}

export function computeScore(_input: ScoringInput): ScoringOutput {
  throw new Error("Not implemented — voir Étape 2")
}
