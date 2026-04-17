import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { matchOpportunities } from "./matcher"
import type { MatchInput, Opportunity, ScoringOutput } from "@/types/scoring"

const baseScore: ScoringOutput = {
  academic_score: 40,
  financial_score: 40,
  maturity_score: 40,
  global_score: 40,
  segment: "Candidat",
}

const baseAnswers = {
  current_level: "licence_1_2",
  main_objective: "bourse",
  domain: "informatique",
  target_country: "france",
  budget: "moyen",
  academic_level: "licence",
  dossier_maturity: "en_cours",
  main_blocker: "documents",
  timeline: "moyen",
  invest_readiness: "peut_etre",
}

function makeOpp(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: "opp-1",
    title: "Bourse Test",
    is_active: true,
    study_level: "tous",
    category: "bourse",
    domain: "informatique",
    country: "france",
    funding_type: "partial",
    deadline: null,
    budget_required: null,
    ...overrides,
  }
}

function makeInput(overrides: Partial<MatchInput> = {}): MatchInput {
  return {
    score: baseScore,
    answers: baseAnswers,
    opportunities: [makeOpp()],
    ...overrides,
  }
}

describe("matchOpportunities — filtres d'exclusion", () => {
  it("exclut les opportunités inactives", () => {
    const input = makeInput({ opportunities: [makeOpp({ is_active: false })] })
    expect(matchOpportunities(input)).toHaveLength(0)
  })

  it("inclut les opportunités actives", () => {
    const input = makeInput({ opportunities: [makeOpp({ is_active: true })] })
    expect(matchOpportunities(input)).toHaveLength(1)
  })

  it("exclut si study_level incompatible avec academic_level", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "doctorat" })],
      answers: { ...baseAnswers, academic_level: "bac" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })

  it("inclut si study_level = 'tous'", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "tous" })],
      answers: { ...baseAnswers, academic_level: "bac" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })

  it("inclut si study_level compatible avec academic_level", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "licence" })],
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })

  it("exclut les opportunités avec deadline dépassée", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })

  it("inclut les opportunités avec deadline future", () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ deadline: future })],
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

describe("matchOpportunities — score additif", () => {
  it("+30 si catégorie correspond à main_objective", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse", domain: "autre", country: "autre" })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(30)
  })

  it("+25 si domaine contient le domaine utilisateur (insensible à la casse)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "Informatique Avancée", country: "autre" })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(25)
  })

  it("+20 si pays correspond à target_country", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "france" })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(20)
  })

  it("+20 si target_country=peu_importe et funding_type=complete", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "japon", funding_type: "complete" })],
      answers: { ...baseAnswers, target_country: "peu_importe" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(20)
  })

  it("+15 si funding_type=complete et budget=zero", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "autre", funding_type: "complete" })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(15)
  })

  it("+10 si deadline dans les 90 prochains jours", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "autre", deadline: soon })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(10)
  })

  it("aucun bonus si deadline > 90 jours", () => {
    const far = new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "autre", deadline: far })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(0)
  })

  it("score maximum si tous les critères correspondent", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse", domain: "informatique", country: "france", funding_type: "partial", deadline: soon })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(30 + 25 + 20 + 10)
  })
})

describe("matchOpportunities — pénalité budget", () => {
  it("-30 si budget_required dépasse le budget max utilisateur (non exclu)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse", budget_required: 200_000 })],
      answers: { ...baseAnswers, budget: "petit" },
    })
    const result = matchOpportunities(input)
    expect(result).toHaveLength(1)
    expect(result[0].match_score).toBe(30 + 25 + 20 - 30)
  })

  it("pas de pénalité si budget_required est null", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse", budget_required: null })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBeGreaterThanOrEqual(30)
  })
})

describe("matchOpportunities — tri", () => {
  it("trie par match_score décroissant", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const opps: Opportunity[] = [
      makeOpp({ id: "low", category: "autre", domain: "autre", country: "autre", deadline: soon }),
      makeOpp({ id: "high", category: "bourse", domain: "informatique", country: "france" }),
      makeOpp({ id: "mid", category: "bourse", domain: "autre", country: "autre" }),
    ]
    const result = matchOpportunities(makeInput({ opportunities: opps }))
    expect(result[0].opportunity.id).toBe("high")
    expect(result[result.length - 1].match_score).toBeLessThanOrEqual(result[0].match_score)
  })
})

describe("matchOpportunities — justification", () => {
  it("justification non vide si match_score > 0", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse" })],
    })
    const result = matchOpportunities(input)
    expect(result[0].justification).toBeTruthy()
    expect(result[0].justification.length).toBeGreaterThan(0)
  })

  it("justification indique absence de correspondance si score = 0", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "autre", domain: "autre", country: "autre" })],
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(0)
    expect(result[0].justification).toMatch(/aucun/)
  })
})

describe("matchOpportunities — liste vide", () => {
  it("retourne [] si opportunities est vide", () => {
    const input = makeInput({ opportunities: [] })
    expect(matchOpportunities(input)).toEqual([])
  })
})
