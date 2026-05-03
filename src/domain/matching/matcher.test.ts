import { describe, it, expect } from "vitest"
import { matchOpportunities, countZoneFallbacks } from "./matcher"
import type { MatchInput, Opportunity, Recommendation, ScoringOutput } from "@/types/scoring"

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
  it("exclut les opportunités avec deadline passée si horizon court", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
      answers: { ...baseAnswers, timeline: "urgent" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("inclut les opportunités avec deadline passée si horizon long (prochaine édition)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
      answers: { ...baseAnswers, timeline: "long" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
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
  // Hiérarchie : oppLevel = niveau minimum requis, user doit être >= ce niveau
  it("inclut si academic_level > study_level requis (master voit opp bac3)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "bac3" })],
      answers: { ...baseAnswers, academic_level: "master" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("inclut si academic_level = study_level requis (bac3 voit opp bac3)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "bac3" })],
      answers: { ...baseAnswers, academic_level: "bac3" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("exclut si academic_level < study_level requis (bac ne voit pas opp bac5)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "bac5" })],
      answers: { ...baseAnswers, academic_level: "bac" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("licence voit opp bac2 (supérieur au requis)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "bac2" })],
      answers: { ...baseAnswers, academic_level: "licence" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("bac ne voit pas opp master", () => {
    const input = makeInput({
      opportunities: [makeOpp({ study_level: "master" })],
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

// ── Domaine — multidisciplinaire et "autre" ──────────────────────────────────

describe("Filtre — domaine multidisciplinaire et 'autre'", () => {
  it("multidisciplinaire passe pour un utilisateur sciences_tech", () => {
    expect(
      matchOpportunities(makeInput({ opportunities: [makeOpp({ domain: "multidisciplinaire" })] }))
    ).toHaveLength(1)
  })
  it("multidisciplinaire passe quel que soit le domaine utilisateur", () => {
    const input = makeInput({
      opportunities: [makeOpp({ domain: "multidisciplinaire" })],
      answers: { ...baseAnswers, domain: "commerce" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("domain='autre' côté utilisateur → voit les opps de tout domaine", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "a", domain: "sciences_tech" }),
        makeOpp({ id: "b", domain: "commerce" }),
        makeOpp({ id: "c", domain: "multidisciplinaire" }),
      ],
      answers: { ...baseAnswers, domain: "autre" },
    })
    expect(matchOpportunities(input)).toHaveLength(3)
  })
  it("opp domain spécifique exclut un utilisateur d'un autre domaine", () => {
    const input = makeInput({
      opportunities: [makeOpp({ domain: "droit" })],
      answers: { ...baseAnswers, domain: "sciences_tech" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
})

// ── Filtre — deux pays distincts dans la même zone ───────────────────────────

describe("Filtre — deux pays distincts dans la même zone géographique", () => {
  it("belgique et france sont incompatibles même si tous deux en Europe", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "belgique" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("france n'apparaît pas dans une recherche belgique (symétrique)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france" })],
      answers: { ...baseAnswers, target_country: "belgique" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("canada et etats_unis sont incompatibles (même zone Amérique du Nord)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "canada" })],
      answers: { ...baseAnswers, target_country: "etats_unis" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
})

// ── Filtre — timeline "court" et opportunités expirées ───────────────────────

describe("Filtre — timeline 'court' et opportunités expirées", () => {
  it("timeline='court' exclut les opportunités avec deadline passée", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
      answers: { ...baseAnswers, timeline: "court" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("timeline='moyen' inclut les opportunités expirées (prochaine édition)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
      answers: { ...baseAnswers, timeline: "moyen" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})

// ── Scoring — valeurs exactes du bonus pays ──────────────────────────────────

describe("Scoring — bonus pays : valeurs exactes (exact +20 / zone +10 / international +5)", () => {
  it("exact match pays → score = 75 (30+25+20)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
  it("zone fallback (target=france, opp=europe) → score = 65 (30+25+10)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "europe" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 10)
  })
  it("international (target=france, opp=international) → score = 60 (30+25+5)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "international" })],
      answers: { ...baseAnswers, target_country: "france" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 5)
  })
  it("pays dans la zone cible (target=europe, opp=france) → score = 75 (30+25+20, pas +10)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france" })],
      answers: { ...baseAnswers, target_country: "europe" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
  it("classement correct : pays exact > zone > international", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "intl", country: "international" }),
        makeOpp({ id: "zone", country: "europe" }),
        makeOpp({ id: "exact", country: "france" }),
      ],
      answers: { ...baseAnswers, target_country: "france" },
    })
    const result = matchOpportunities(input)
    expect(result[0].opportunity.id).toBe("exact")
    expect(result[1].opportunity.id).toBe("zone")
    expect(result[2].opportunity.id).toBe("intl")
  })
  it("peu_importe + financement complet → bonus pays +20 (score = 90 avec budget=zero)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete", budget_required: 0 })],
      answers: { ...baseAnswers, target_country: "peu_importe", budget: "zero" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20 + 15)
  })
  it("peu_importe + financement partiel → pas de bonus pays (score = 55)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "partial" })],
      answers: { ...baseAnswers, target_country: "peu_importe" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25)
  })
})

// ── Scoring — bonus financement complet conditionnel ─────────────────────────

describe("Scoring — bonus financement complet (uniquement si budget=zero)", () => {
  it("funding=complete + budget=zero → +15 (score = 90)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete", budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20 + 15)
  })
  it("funding=complete + budget=petit → pas de +15 (score = 75)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete" })],
      answers: { ...baseAnswers, budget: "petit" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
  it("funding=partial + budget=zero → pas de +15 (score = 75)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "partial", budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
})

// ── Scoring — deadline soon (borne des 90 jours) ─────────────────────────────

describe("Scoring — deadline soon (borne des 90 jours)", () => {
  const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

  it("deadline dans 89 jours → +10 (dans la fenêtre)", () => {
    const input = makeInput({ opportunities: [makeOpp({ deadline: daysFromNow(89) })] })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20 + 10)
  })
  it("deadline dans 91 jours → pas de +10 (hors fenêtre)", () => {
    const input = makeInput({ opportunities: [makeOpp({ deadline: daysFromNow(91) })] })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
  it("deadline null → pas de +10", () => {
    const input = makeInput({ opportunities: [makeOpp({ deadline: null })] })
    expect(matchOpportunities(input)[0].match_score).toBe(30 + 25 + 20)
  })
})

// ── Ordering — actives avant expirées ────────────────────────────────────────

describe("Ordering — actives avant expirées et champ isExpired", () => {
  const future = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

  it("les actives apparaissent en premier, les expirées en dernier", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "expired", deadline: "2020-01-01" }),
        makeOpp({ id: "active", deadline: future }),
      ],
      answers: { ...baseAnswers, timeline: "long" },
    })
    const result = matchOpportunities(input)
    expect(result[0].opportunity.id).toBe("active")
    expect(result[1].opportunity.id).toBe("expired")
  })
  it("isExpired=true pour deadline passée, false pour deadline future", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "past", deadline: "2020-01-01" }),
        makeOpp({ id: "fut", deadline: future }),
      ],
      answers: { ...baseAnswers, timeline: "long" },
    })
    const result = matchOpportunities(input)
    expect(result.find((r) => r.opportunity.id === "past")!.isExpired).toBe(true)
    expect(result.find((r) => r.opportunity.id === "fut")!.isExpired).toBe(false)
  })
  it("les expirées sont triées par score entre elles (décroissant)", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "exp-low",  deadline: "2020-01-01", funding_type: "partial" }),
        makeOpp({ id: "exp-high", deadline: "2020-01-01", funding_type: "complete", budget_required: 0 }),
      ],
      answers: { ...baseAnswers, timeline: "long", budget: "zero" },
    })
    const expired = matchOpportunities(input).filter((r) => r.isExpired)
    expect(expired[0].opportunity.id).toBe("exp-high")
    expect(expired[1].opportunity.id).toBe("exp-low")
  })
  it("isExpired=false pour deadline null", () => {
    const result = matchOpportunities(makeInput({ opportunities: [makeOpp({ deadline: null })] }))
    expect(result[0].isExpired).toBe(false)
  })
})

// ── Badges — top ─────────────────────────────────────────────────────────────

describe("Badges — top (2 premiers résultats actifs)", () => {
  const nOpps = (n: number) => Array.from({ length: n }, (_, i) => makeOpp({ id: `opp-${i}` }))

  it("le 1er et le 2e résultat ont badge='top'", () => {
    const result = matchOpportunities(makeInput({ opportunities: nOpps(4) }))
    expect(result[0].badge).toBe("top")
    expect(result[1].badge).toBe("top")
  })
  it("le 3e résultat n'a pas badge='top' (profil faible)", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "debut" },
    })
    const result = matchOpportunities(input)
    expect(result[2].badge).toBeNull()
    expect(result[3].badge).toBeNull()
  })
  it("si 1 seul résultat actif, il a badge='top'", () => {
    const result = matchOpportunities(makeInput())
    expect(result[0].badge).toBe("top")
  })
  it("badge=null pour les résultats expirés (même s'ils seraient top)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ deadline: "2020-01-01" })],
      answers: { ...baseAnswers, timeline: "long" },
    })
    const result = matchOpportunities(input)
    expect(result[0].isExpired).toBe(true)
    expect(result[0].badge).toBeNull()
  })
})

// ── Badges — probability (strongProfile) ─────────────────────────────────────

describe("Badges — probability (profil fort : dossier avancé + niveau ≥ licence)", () => {
  const nOpps = (n: number) => Array.from({ length: n }, (_, i) => makeOpp({ id: `opp-${i}` }))

  it("positions 2 et 3 → 'probability' si dossier='avance' + niveau='master'", () => {
    const input = makeInput({
      opportunities: nOpps(5),
      answers: { ...baseAnswers, dossier_maturity: "avance", academic_level: "master" },
    })
    const result = matchOpportunities(input)
    expect(result[2].badge).toBe("probability")
    expect(result[3].badge).toBe("probability")
  })
  it("position 4+ → null même avec profil fort", () => {
    const input = makeInput({
      opportunities: nOpps(6),
      answers: { ...baseAnswers, dossier_maturity: "avance", academic_level: "master" },
    })
    const result = matchOpportunities(input)
    expect(result[4].badge).toBeNull()
    expect(result[5].badge).toBeNull()
  })
  it("positions 2-3 → null si profil faible (dossier='debut' + niveau='bac')", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "debut", academic_level: "bac" },
    })
    const result = matchOpportunities(input)
    expect(result[2].badge).toBeNull()
    expect(result[3].badge).toBeNull()
  })
  it("strongProfile=false si dossier avancé mais niveau bac (condition ET)", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "avance", academic_level: "bac" },
    })
    expect(matchOpportunities(input)[2].badge).toBeNull()
  })
  it("strongProfile=false si niveau master mais dossier en début (condition ET)", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "debut", academic_level: "master" },
    })
    expect(matchOpportunities(input)[2].badge).toBeNull()
  })
  it("strongProfile=true si dossier='pret' et niveau='doctorat'", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "pret", academic_level: "doctorat" },
    })
    expect(matchOpportunities(input)[2].badge).toBe("probability")
  })
  it("strongProfile=true si dossier='pret' et niveau='licence'", () => {
    const input = makeInput({
      opportunities: nOpps(4),
      answers: { ...baseAnswers, dossier_maturity: "pret", academic_level: "licence" },
    })
    expect(matchOpportunities(input)[2].badge).toBe("probability")
  })
})

// ── Justification — troncature à 3 raisons ───────────────────────────────────

describe("Justification — troncature à 3 raisons maximum", () => {
  it("affiche au plus 3 raisons même quand 5 bonus s'appliquent", () => {
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const input = makeInput({
      opportunities: [makeOpp({ funding_type: "complete", deadline: soon, budget_required: 0 })],
      answers: { ...baseAnswers, budget: "zero" },
    })
    const parts = matchOpportunities(input)[0].justification.split(", ")
    expect(parts.length).toBeLessThanOrEqual(3)
    expect(parts.length).toBeGreaterThan(0)
  })
  it("la justification est une chaîne non vide pour tout match", () => {
    const result = matchOpportunities(makeInput())
    expect(typeof result[0].justification).toBe("string")
    expect(result[0].justification.trim().length).toBeGreaterThan(0)
  })
})

// ── countZoneFallbacks ────────────────────────────────────────────────────────

describe("countZoneFallbacks", () => {
  function makeRec(country: string): Recommendation {
    return {
      opportunity: makeOpp({ country }),
      match_score: 75,
      justification: "test",
      badge: null,
      isExpired: false,
    }
  }

  it("retourne 0 si targetCountry est une zone (pas un pays précis)", () => {
    expect(countZoneFallbacks([makeRec("europe")], "europe")).toBe(0)
  })
  it("retourne 0 si targetCountry est 'peu_importe'", () => {
    expect(countZoneFallbacks([makeRec("europe")], "peu_importe")).toBe(0)
  })
  it("retourne 0 si toutes les oppos correspondent exactement au pays cible", () => {
    const recs = [makeRec("france"), makeRec("france")]
    expect(countZoneFallbacks(recs, "france")).toBe(0)
  })
  it("retourne 0 si les oppos sont toutes internationales", () => {
    expect(countZoneFallbacks([makeRec("international")], "france")).toBe(0)
  })
  it("compte les oppos de zone (europe) quand target est un pays précis (france)", () => {
    const recs = [makeRec("france"), makeRec("europe"), makeRec("international")]
    expect(countZoneFallbacks(recs, "france")).toBe(1)
  })
  it("compte plusieurs oppos de zone pour un même pays cible", () => {
    const recs = [makeRec("europe"), makeRec("europe"), makeRec("france")]
    expect(countZoneFallbacks(recs, "france")).toBe(2)
  })
  it("liste vide → retourne 0", () => {
    expect(countZoneFallbacks([], "france")).toBe(0)
  })
})

// ── Scénario régression — Belgique ───────────────────────────────────────────

describe("Scénario régression — Belgique (bac3 requis, utilisateur master)", () => {
  const belgiumAnswers = { ...baseAnswers, target_country: "belgique", academic_level: "master" }

  it("un utilisateur master voit les bourses belges exigeant bac3 minimum", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "belgique", study_level: "bac3" })],
      answers: belgiumAnswers,
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
  it("classement correct : belgique (75) > europe (65) > international (60)", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "intl", country: "international", study_level: "tous" }),
        makeOpp({ id: "eu",   country: "europe",        study_level: "tous" }),
        makeOpp({ id: "be",   country: "belgique",      study_level: "bac3" }),
      ],
      answers: belgiumAnswers,
    })
    const result = matchOpportunities(input)
    expect(result[0].opportunity.id).toBe("be")
    expect(result[1].opportunity.id).toBe("eu")
    expect(result[2].opportunity.id).toBe("intl")
  })
  it("les scores correspondent aux bonus attendus", () => {
    const input = makeInput({
      opportunities: [
        makeOpp({ id: "be",   country: "belgique",      study_level: "bac3" }),
        makeOpp({ id: "eu",   country: "europe",        study_level: "tous" }),
        makeOpp({ id: "intl", country: "international", study_level: "tous" }),
      ],
      answers: belgiumAnswers,
    })
    const result = matchOpportunities(input)
    const beScore   = result.find((r) => r.opportunity.id === "be")!.match_score
    const euScore   = result.find((r) => r.opportunity.id === "eu")!.match_score
    const intlScore = result.find((r) => r.opportunity.id === "intl")!.match_score
    expect(beScore).toBe(30 + 25 + 20)   // 75
    expect(euScore).toBe(30 + 25 + 10)   // 65
    expect(intlScore).toBe(30 + 25 + 5)  // 60
  })
  it("la France n'apparaît pas dans une recherche Belgique (pays distincts)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "france", study_level: "tous" })],
      answers: belgiumAnswers,
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("un utilisateur de niveau bac ne voit pas les bourses belges (bac3 requis)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "belgique", study_level: "bac3" })],
      answers: { ...belgiumAnswers, academic_level: "bac" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("un utilisateur bac2 ne voit pas les bourses belges (bac3 requis)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "belgique", study_level: "bac3" })],
      answers: { ...belgiumAnswers, academic_level: "bac2" },
    })
    expect(matchOpportunities(input)).toHaveLength(0)
  })
  it("un utilisateur doctorat voit les bourses belges bac3 (hiérarchie des niveaux)", () => {
    const input = makeInput({
      opportunities: [makeOpp({ country: "belgique", study_level: "bac3" })],
      answers: { ...belgiumAnswers, academic_level: "doctorat" },
    })
    expect(matchOpportunities(input)).toHaveLength(1)
  })
})
