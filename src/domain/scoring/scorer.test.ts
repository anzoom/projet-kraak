import { describe, it, expect } from "vitest"
import { computeScore } from "./scorer"
import type { TestAnswers } from "@/types/test"

// invest_readiness supprimée du questionnaire — non incluse dans les answers de test
const fullAnswers: TestAnswers = {
  current_level: "lycee",
  main_objective: "bourse",
  domain: "informatique",
  target_country: "france",
  budget: "zero",
  academic_level: "bac",
  dossier_maturity: "debut",
  main_blocker: "information",
  timeline: "long",
}

describe("computeScore", () => {
  it("retourne un segment Explorer pour un profil débutant", () => {
    const result = computeScore(fullAnswers)
    // academic: (20+20)/2=20, financial: 20, maturity: 10*0.55+30*0.30+30*0.15=19
    // global: 20*0.35 + 20*0.25 + 19*0.40 = 7 + 5 + 7.6 = 19.6
    expect(result.segment).toBe("Explorer")
    expect(result.global_score).toBeLessThan(40)
  })

  it("retourne un segment Candidat pour un profil intermédiaire", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "licence_1_2",
      academic_level: "bac2",
      budget: "moyen",
      dossier_maturity: "en_cours",
      timeline: "moyen",
      main_blocker: "documents",
    }
    const result = computeScore(answers)
    // academic: (40+40)/2=40, financial: 70, maturity: 40*0.55+50*0.30+60*0.15=46
    // global: 40*0.35 + 70*0.25 + 46*0.40 = 14 + 17.5 + 18.4 = 49.9
    expect(result.segment).toBe("Candidat")
    expect(result.global_score).toBeGreaterThanOrEqual(40)
    expect(result.global_score).toBeLessThan(70)
  })

  it("retourne un segment Finaliste pour un profil avancé", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "master",
      academic_level: "master",
      budget: "confortable",
      dossier_maturity: "pret",
      timeline: "urgent",
      main_blocker: "confiance",
    }
    const result = computeScore(answers)
    // academic: (80+80)/2=80, financial: 100, maturity: 100*0.55+90*0.30+70*0.15=92.5
    // global: 80*0.35 + 100*0.25 + 92.5*0.40 = 28 + 25 + 37 = 90
    expect(result.segment).toBe("Finaliste")
    expect(result.global_score).toBeGreaterThanOrEqual(70)
  })

  it("frontière ≥ 40 → Candidat", () => {
    // academic=40(bac2), financial=40(petit), maturity=en_cours+moyen+documents=46
    // global: 40*0.35 + 40*0.25 + 46*0.40 = 14 + 10 + 18.4 = 42.4 → Candidat
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "licence_1_2",
      academic_level: "bac2",
      budget: "petit",
      dossier_maturity: "en_cours",
      timeline: "moyen",
      main_blocker: "documents",
    }
    const result = computeScore(answers)
    expect(result.segment).toBe("Candidat")
    expect(result.global_score).toBeGreaterThanOrEqual(40)
  })

  it("score académique pour master/master vaut 80", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "master",
      academic_level: "master",
    }
    const result = computeScore(answers)
    expect(result.academic_score).toBe(80)
  })

  it("score financier pour budget=zero vaut 20 (invest_readiness supprimée)", () => {
    const result = computeScore(fullAnswers)
    expect(result.financial_score).toBe(20)
  })

  it("score financier pour budget=confortable vaut 100", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      budget: "confortable",
    }
    const result = computeScore(answers)
    expect(result.financial_score).toBe(100)
  })

  it("score de maturité pour pret/urgent/confiance vaut 92.5", () => {
    // 100*0.55 + 90*0.30 + 70*0.15 = 55 + 27 + 10.5 = 92.5
    const answers: TestAnswers = {
      ...fullAnswers,
      dossier_maturity: "pret",
      timeline: "urgent",
      main_blocker: "confiance",
    }
    const result = computeScore(answers)
    expect(result.maturity_score).toBeCloseTo(92.5, 1)
  })

  it("valeur inconnue remplacée par 0 sans exception", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "valeur_inconnue",
      academic_level: "inconnu",
    }
    expect(() => computeScore(answers)).not.toThrow()
    const result = computeScore(answers)
    expect(result.academic_score).toBe(0)
  })

  it("est idempotent : deux appels identiques → même résultat", () => {
    const r1 = computeScore(fullAnswers)
    const r2 = computeScore(fullAnswers)
    expect(r1).toEqual(r2)
  })

  it("retourne les 5 champs attendus", () => {
    const result = computeScore(fullAnswers)
    expect(result).toHaveProperty("academic_score")
    expect(result).toHaveProperty("financial_score")
    expect(result).toHaveProperty("maturity_score")
    expect(result).toHaveProperty("global_score")
    expect(result).toHaveProperty("segment")
  })
})
