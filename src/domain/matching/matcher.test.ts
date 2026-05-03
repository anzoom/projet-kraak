import { describe, it, expect } from "vitest"
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
  origin_country: "senegal",
  current_level: "licence_3",
  main_objective: "bourse",
  domain: "sciences_tech",
  target_country: "europe",
  budget: "moyen",
  academic_level: "licence",
  dossier_maturity: "en_cours",
  main_blocker: "information",
  timeline: "moyen",
}

function makeOpp(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: "opp-1",
    title: "Bourse Test",
    is_active: true,
    study_level: "tous",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
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

// ── Filtres d'exclusion de base ──────────────────────────────────────────────

describe("Filtre — is_active", () => {
  it("exclut les opportunités inactives", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ is_active: false })] }))).toHaveLength(0)
  })
  it("inclut les opportunités actives", () => {
    expect(matchOpportunities(makeInput())).toHaveLength(1)
  })
})

describe("Filtre — deadline expirée", () => {
  it("exclut les opportunités avec deadline passée", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ deadline: "2020-01-01" })] }))).toHaveLength(0)
  })
  it("inclut les opportunités avec deadline future", () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ deadline: future })] }))).toHaveLength(1)
  })
  it("inclut les opportunités sans deadline", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ deadline: null })] }))).toHaveLength(1)
  })
})

describe("Filtre — study_level / dernier diplôme", () => {
  it("inclut si study_level = 'tous'", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ study_level: "tous" })] }))).toHaveLength(1)
  })
  it("inclut si study_level correspond à academic_level", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ study_level: "licence" })] }))).toHaveLength(1)
  })
  it("exclut si study_level incompatible avec academic_level", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "doctorat" })],
      answers: { ...baseAnswers, academic_level: "bac" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
})

// ── Filtre — objectif principal / category ───────────────────────────────────

describe("Filtre — objectif principal (catégorie)", () => {
  it("inclut si category === main_objective", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ category: "bourse" })] }))).toHaveLength(1)
  })
  it("exclut si category !== main_objective", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ category: "fellowship" })] }))).toHaveLength(0)
  })
  it("exclut un programme pour un utilisateur cherchant une bourse", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ category: "programme" })] }))).toHaveLength(0)
  })
  it("exclut une bourse pour un utilisateur cherchant un fellowship", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "bourse" })],
      answers: { ...baseAnswers, main_objective: "fellowship" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("insensible à la casse et aux accents", () => {
    const input = makeInput({
      opportunities: [makeOpp({ category: "Bourse" })],
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Filtre — domaine ─────────────────────────────────────────────────────────

describe("Filtre — domaine", () => {
  it("inclut si domain === answers.domain", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ domain: "sciences_tech" })] }))).toHaveLength(1)
  })
  it("exclut si domain !== answers.domain", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ domain: "commerce" })] }))).toHaveLength(0)
  })
  it("exclut si domain est un sous-ensemble (plus de .includes)", () => {
    // "sciences_tech" ne doit pas matcher un domaine "sciences"
    const input = makeInput({
      opportunities: [makeOpp({ domain: "sciences_sociales" })],
      answers: { ...baseAnswers, domain: "sciences" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("ne filtre pas si answers.domain est vide", () => {
    const input = makeInput({
      opportunities: [makeOpp({ domain: "commerce" })],
      answers: { ...baseAnswers, domain: "" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Filtre — pays cible ──────────────────────────────────────────────────────

describe("Filtre — zone géographique cible", () => {
  it("inclut si country === target_country", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ country: "europe" })] }))).toHaveLength(1)
  })
  it("exclut si country !== target_country", () => {
    expect(matchOpportunities(makeInput({ opportunities: [makeOpp({ country: "amerique_nord" })] }))).toHaveLength(0)
  })
  it("peu_importe — inclut toutes les opportunités", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "amerique_nord" }), makeOpp({ id: "2", country: "afrique" })],
      answers: { ...baseAnswers, target_country: "peu_importe" },
    })
    expect(matchOpportunities(input)).toHaveLength(2)
  })
  it("afrique — inclut uniquement les opportunités country=afrique", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "af", country: "afrique" }),
        makeOpp({ id: "eu", country: "europe" }),
      ],
      answers: { ...baseAnswers, target_country: "afrique" },
    })
    const result = matchOpportunities(input)
    expect(result).toHaveLength(1)
    expect(result[0].opportunity.id).toBe("af")
  })
  it("amerique_nord — correspondance exacte", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "amerique_nord" })],
      answers: { ...baseAnswers, target_country: "amerique_nord" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Filtre — matching hiérarchique pays/zone ─────────────────────────────────

describe("Filtre — matching hiérarchique (pays précis ↔ zone)", () => {
  it("target=france inclut opp country=france (exact)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("target=france inclut opp country=europe (zone fallback)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "europe" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("target=france exclut opp country=amerique_nord (hors zone)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "amerique_nord" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("target=europe inclut opp country=france (pays dans la zone)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france" })],
      answers: { ...baseAnswers, target_country: "europe" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("target=canada inclut opp country=amerique_nord (zone fallback)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "amerique_nord" })],
      answers: { ...baseAnswers, target_country: "canada" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("target=canada exclut opp country=europe (hors zone)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "europe" })],
      answers: { ...baseAnswers, target_country: "canada" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("target=france — exact match score > zone fallback score", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "exact", country: "france" }),
        makeOpp({ id: "zone",  country: "europe" }),
      ],
      answers: { ...baseAnswers, target_country: "france" },
    })
    const result = matchOpportunities(input)
    expect(result).toHaveLength(2)
    const exactScore = result.find((r) => r.opportunity.id === "exact")!.match_score
    const zoneScore  = result.find((r) => r.opportunity.id === "zone")!.match_score
    expect(exactScore).toBeGreaterThan(zoneScore)
  })
  it("international passe toujours, même pour un pays précis", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "international" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Filtre — budget ───────────────────────────────────────────────────────────

describe("Filtre — budget", () => {
  it("inclut si budget_required est null (pas de frais renseignés)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: null })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("inclut si budget_required = 0 et budget = zero", () => {
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("exclut si budget_required dépasse le budget max utilisateur", () => {
    // budget "petit" → max 500_000 FCFA ; oppo requiert 600_000
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: 600_000 })],
      answers: { ...baseAnswers, budget: "petit" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("exclut si budget_required > 0 et budget = zero", () => {
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: 50_000 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("inclut si budget_required <= budget max utilisateur", () => {
    // budget "moyen" → max 500_000 FCFA ; oppo requiert 300_000
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: 300_000 })],
      answers: { ...baseAnswers, budget: "moyen" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("confortable — inclut toujours (pas de limite)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ budget_required: 10_000_000 })],
      answers: { ...baseAnswers, budget: "confortable" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Filtre — horizon de départ (timeline) ────────────────────────────────────

describe("Filtre — horizon de départ", () => {
  const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

  it("null deadline passe toujours le filtre timeline", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: null })],
      answers: { ...baseAnswers, timeline: "urgent" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("urgent — inclut si deadline dans 90 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(60) })],
      answers: { ...baseAnswers, timeline: "urgent" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("urgent — exclut si deadline > 90 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(120) })],
      answers: { ...baseAnswers, timeline: "urgent" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("court — inclut si deadline dans 180 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(150) })],
      answers: { ...baseAnswers, timeline: "court" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("court — exclut si deadline > 180 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(200) })],
      answers: { ...baseAnswers, timeline: "court" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("moyen — inclut si deadline dans 365 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(300) })],
      answers: { ...baseAnswers, timeline: "moyen" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("moyen — exclut si deadline > 365 jours", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(400) })],
      answers: { ...baseAnswers, timeline: "moyen" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("long — inclut toujours (pas de limite haute)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: daysFromNow(600) })],
      answers: { ...baseAnswers, timeline: "long" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Scoring et classement ────────────────────────────────────────────────────

describe("Scoring — bonus", () => {
  it("+30 catégorie (toujours après filtre)", () => {
    const result = matchOpportunities(makeInput())
    expect(result[0].match_score).toBeGreaterThanOrEqual(30)
  })
  it("+25 domaine (toujours si domaine renseigné)", () => {
    const result = matchOpportunities(makeInput())
    expect(result[0].match_score).toBeGreaterThanOrEqual(55)
  })
  it("+20 pays (toujours pour cible spécifique)", () => {
    const result = matchOpportunities(makeInput())
    expect(result[0].match_score).toBeGreaterThanOrEqual(75)
  })
  it("+15 financement complet si budget=zero", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete", budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(30 + 25 + 20 + 15)
  })
  it("+10 deadline dans 90 jours", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({ opportunities: [makeOpp({ deadline: soon })] })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(30 + 25 + 20 + 10)
  })
  it("score maximum : tous les bonus", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete", deadline: soon, budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(30 + 25 + 20 + 15 + 10)
  })
  it("pas de bonus pays pour peu_importe sans financement complet", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "partial" })],
      answers: { ...baseAnswers, target_country: "peu_importe" },
    })
    const result = matchOpportunities(input)
    expect(result[0].match_score).toBe(30 + 25)
  })
})

describe("Scoring — tri décroissant", () => {
  it("trie par match_score décroissant", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const opps: Opportunity[] = [
      makeOpp({ id: "base", funding_type: "partial", deadline: null }),
      makeOpp({ id: "with_deadline", funding_type: "partial", deadline: soon }),
      makeOpp({ id: "complete_funding", funding_type: "complete", deadline: soon, budget_required: 0 }),
    ]
    const result = matchOpportunities(makeInput({
      opportunities: opps,
      answers: { ...baseAnswers, budget: "zero" },
    }))
    expect(result[0].opportunity.id).toBe("complete_funding")
    expect(result[result.length - 1].match_score).toBeLessThanOrEqual(result[0].match_score)
  })
})

// ── Cas limites ───────────────────────────────────────────────────────────────

describe("Cas limites", () => {
  it("retourne [] si la liste est vide", () => {
    expect(matchOpportunities(makeInput({ opportunities: [] }))).toEqual([])
  })
  it("justification non vide si match", () => {
    const result = matchOpportunities(makeInput())
    expect(result[0].justification).toBeTruthy()
    expect(result[0].justification.length).toBeGreaterThan(0)
  })
})
