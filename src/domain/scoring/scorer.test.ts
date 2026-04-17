import { describe, it, expect } from "vitest"
import { computeScore } from "./scorer"
import type { TestAnswers } from "@/types/test"

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
  invest_readiness: "non_certain",
}

describe("computeScore", () => {
  it("retourne un segment Explorer pour un profil débutant", () => {
    const result = computeScore(fullAnswers)
    // academic: (20+20)/2=20, financial: 20*0.7+10*0.3=17, maturity: (10+30+30)/3≈23.3
    // global: 20*0.4 + 17*0.3 + 23.3*0.3 = 8 + 5.1 + 7 = 20.1
    expect(result.segment).toBe("Explorer")
    expect(result.global_score).toBeLessThan(40)
  })

  it("retourne un segment Candidat pour un profil intermédiaire", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "licence_1_2",
      academic_level: "bac2",
      budget: "moyen",
      invest_readiness: "peut_etre",
      dossier_maturity: "en_cours",
      timeline: "moyen",
      main_blocker: "documents",
    }
    const result = computeScore(answers)
    // academic: (40+40)/2=40, financial: 70*0.7+60*0.3=67, maturity: (40+50+60)/3=50
    // global: 40*0.4 + 67*0.3 + 50*0.3 = 16 + 20.1 + 15 = 51.1
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
      invest_readiness: "oui_certain",
      dossier_maturity: "pret",
      timeline: "urgent",
      main_blocker: "confiance",
    }
    const result = computeScore(answers)
    // academic: (80+80)/2=80, financial: 100*0.7+100*0.3=100, maturity: (100+90+70)/3≈86.7
    // global: 80*0.4 + 100*0.3 + 86.7*0.3 = 32 + 30 + 26 = 88
    expect(result.segment).toBe("Finaliste")
    expect(result.global_score).toBeGreaterThanOrEqual(70)
  })

  it("frontière exacte à 40 → Candidat", () => {
    // On cherche des valeurs qui produisent global_score = 40
    // academic=40 (licence_1_2 + bac2), financial=17 (zero + non_certain), maturity=50 (en_cours + moyen + eligibilite)
    // global: 40*0.4 + 17*0.3 + 50*0.3 = 16 + 5.1 + 15 = 36.1 (trop bas)
    // On utilise academic=60, financial=40, maturity=23.3
    // global: 60*0.4 + 40*0.3 + 23.3*0.3 = 24 + 12 + 7 = 43 → Candidat
    const answers: TestAnswers = {
      ...fullAnswers,
      current_level: "licence_3",
      academic_level: "licence",
      budget: "petit",
      invest_readiness: "non_certain",
    }
    const result = computeScore(answers)
    // academic: (60+60)/2=60, financial: 40*0.7+10*0.3=31, maturity: (10+30+30)/3≈23.3
    // global: 60*0.4 + 31*0.3 + 23.3*0.3 = 24 + 9.3 + 7 = 40.3
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

  it("score financier pour budget=zero et invest_readiness=non_certain vaut 17", () => {
    const result = computeScore(fullAnswers)
    expect(result.financial_score).toBeCloseTo(17)
  })

  it("score financier pour budget=confortable et invest_readiness=oui_certain vaut 100", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      budget: "confortable",
      invest_readiness: "oui_certain",
    }
    const result = computeScore(answers)
    expect(result.financial_score).toBe(100)
  })

  it("score de maturité pour pret/urgent/confiance vaut environ 87", () => {
    const answers: TestAnswers = {
      ...fullAnswers,
      dossier_maturity: "pret",
      timeline: "urgent",
      main_blocker: "confiance",
    }
    const result = computeScore(answers)
    expect(result.maturity_score).toBeCloseTo((100 + 90 + 70) / 3, 1)
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
