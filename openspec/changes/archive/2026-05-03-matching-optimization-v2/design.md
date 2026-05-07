## Architecture

Aucune modification de schéma base de données, d'API, ni de routes. Tous les changements sont dans :
- Le domaine métier (`src/domain/scoring/`, `src/domain/matching/`)
- Les données statiques (`src/data/questions.ts`)
- Les composants de résultats (`src/components/features/results/`)

Le `FeasibilityScore` est calculé dans le matcher et ajouté au type `Recommendation` existant. Pas de nouvelle table Prisma, pas de nouvel endpoint.

## Corrections bugs

### 1. `src/domain/scoring/scorer.ts` — bug `invest_readiness`

**Avant (cassé) :**
```ts
const financial_score =
  lookup(SCORING_RULES.budget, answers.budget) * 0.7 +
  lookup(SCORING_RULES.invest_readiness, answers.invest_readiness) * 0.3
```

**Après :**
```ts
const financial_score = lookup(SCORING_RULES.budget, answers.budget)
```

Et repondération globale :
```ts
const global_score =
  academic_score * 0.35 +
  financial_score * 0.25 +
  maturity_score * 0.40
```

Et repondération interne maturity_score :
```ts
const maturity_score =
  lookup(SCORING_RULES.dossier_maturity, answers.dossier_maturity) * 0.55 +
  lookup(SCORING_RULES.timeline, answers.timeline) * 0.30 +
  lookup(SCORING_RULES.main_blocker, answers.main_blocker) * 0.15
```

### 2. `src/domain/matching/matcher.ts` — filtre budget=zero

Ajouter dans la boucle `for (const opp of opportunities)`, après le filtre budget existant (filtre 7) :

```ts
// Filtre 7bis — budget zéro : uniquement les opportunités entièrement financées
if (answers.budget === "zero" && opp.funding_type !== "complete") continue
```

## Améliorations moteur de matching

### `MATCH_BONUS` — nouvelles valeurs

```ts
const MATCH_BONUS = {
  category: 30,           // inchangé
  domain: 20,             // réduit de 25 → 20
  country: 20,            // inchangé
  country_zone_fallback: 8,  // réduit de 10 → 8
  country_international: 5,   // inchangé
  complete_funding_zero: 20,  // porté de 15 → 20 (budget=zero)
  complete_funding_any: 10,   // nouveau : bonus même si budget > zéro
  deadline_soon: 10,      // inchangé
} as const
```

Et dans `scoreOpportunity` :

```ts
// Financement complet — deux niveaux selon le budget utilisateur
if (opp.funding_type === "complete") {
  if (answers.budget === "zero") {
    score += MATCH_BONUS.complete_funding_zero
    reasons.push("financement 100% disponible — aucun apport requis")
  } else {
    score += MATCH_BONUS.complete_funding_any
    reasons.push("opportunité entièrement financée")
  }
}
```

## Nouveau type `FeasibilityScore`

### `src/types/scoring.ts` — ajout

```ts
export type FeasibilityFinancial = "ok" | "risque" | "bloquant"
export type FeasibilityAcademic = "ok" | "limite"
export type FeasibilityTemporal = "urgent" | "confortable" | "hors_fenetre"

export interface FeasibilityScore {
  financial: FeasibilityFinancial
  academic: FeasibilityAcademic
  temporal: FeasibilityTemporal
}

// Ajout dans Recommendation existant
export interface Recommendation {
  opportunity: Opportunity
  match_score: number
  justification: string
  badge: RecommendationBadge
  isExpired: boolean
  feasibility: FeasibilityScore  // nouveau
}
```

### Calcul dans `matcher.ts`

```ts
function computeFeasibility(
  opp: Opportunity,
  answers: MatchInput["answers"],
  budgetMax: number,
): FeasibilityScore {
  // Financier
  let financial: FeasibilityFinancial = "ok"
  if (opp.funding_type !== "complete" && answers.budget === "zero") {
    financial = "bloquant"
  } else if (opp.budget_required !== null && opp.budget_required > budgetMax * 0.5) {
    financial = "risque"
  }

  // Académique
  const oppRank = LEVEL_RANK[opp.study_level] ?? 0
  const userRank = LEVEL_RANK[answers.academic_level ?? "bac"] ?? 0
  const academic: FeasibilityAcademic = (oppRank - userRank) <= 1 ? "ok" : "limite"

  // Temporel
  let temporal: FeasibilityTemporal = "confortable"
  if (opp.deadline) {
    const daysUntil = (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    if (daysUntil < 30) temporal = "urgent"
    else if (daysUntil <= 90) temporal = "confortable"
    else temporal = "confortable"
  }

  return { financial, academic, temporal }
}
```

### Justifications enrichies depuis `FeasibilityScore`

Remplacer la fonction `buildJustification` dans `matcher.ts` :

```ts
function buildEnrichedJustification(
  opp: Opportunity,
  answers: MatchInput["answers"],
  feasibility: FeasibilityScore,
  reasons: string[],
): string {
  const parts: string[] = []

  if (feasibility.financial === "ok" && opp.funding_type === "complete" && answers.budget === "zero") {
    parts.push("✅ Financement intégral — aucun apport de ta part")
  } else if (reasons.some(r => r.includes("pays cible"))) {
    const countryLabel = opp.country.charAt(0).toUpperCase() + opp.country.slice(1)
    parts.push(`✅ Opportunité en ${countryLabel}, ta zone cible`)
  }

  if (answers.academic_level) {
    if (feasibility.academic === "ok") {
      parts.push(`✅ Ton niveau ${answers.academic_level} est compatible`)
    } else {
      parts.push("⚡ Niveau limite — un dossier solide peut compenser")
    }
  }

  if (feasibility.temporal === "urgent") {
    parts.push("⏰ Deadline proche — candidate rapidement")
  } else if (answers.domain && answers.domain !== "autre") {
    parts.push(`✅ Domaine correspondant à ta filière`)
  }

  return parts.slice(0, 3).join(" · ") || reasons.slice(0, 2).join(", ")
}
```

## Nouveau composant `KraakDiagnostic`

### `src/components/features/results/KraakDiagnostic.tsx` — nouveau

Composant Server Component (props statiques depuis les réponses utilisateur).

```
┌──────────────────────────────────────────┐
│  Ton profil KRAAK                        │
│  ─────────────────────────────────────── │
│  🎯 Objectif : Bourse — Europe           │
│  💰 Contrainte : Budget zéro             │
│  ⚠️ Vigilance : Documents manquants     │
│  ⏱ Horizon : 3 à 6 mois                 │
└──────────────────────────────────────────┘
```

**Logique de génération des lignes (max 4) :**

```ts
type DiagnosticLine = { icon: string; text: string }

function buildDiagnosticLines(answers: TestAnswers): DiagnosticLine[] {
  const lines: DiagnosticLine[] = []

  // Ligne 1 — objectif + zone (toujours présente)
  const objectifLabel = getOptionLabel("main_objective", answers.main_objective)
  const zoneLabel = getOptionLabel("target_country", answers.target_country)
  lines.push({ icon: "🎯", text: `Objectif : ${objectifLabel} — ${zoneLabel}` })

  // Ligne 2 — budget (si contraignant)
  if (answers.budget === "zero") {
    lines.push({ icon: "💰", text: "Contrainte : Budget zéro — opportunités 100% financées uniquement" })
  } else if (answers.budget === "petit") {
    lines.push({ icon: "💰", text: "Budget : Limité — on filtre les opportunités accessibles" })
  }

  // Ligne 3 — point de vigilance depuis main_blocker
  const vigilanceMap: Record<string, string> = {
    confiance: "Accompagnement recommandé",
    documents: "Documents à préparer",
    eligibilite: "Éligibilité à vérifier",
    financement: "Financement insuffisant",
    information: "À explorer activement",
  }
  if (answers.main_blocker && vigilanceMap[answers.main_blocker]) {
    lines.push({ icon: "⚠️", text: `Vigilance : ${vigilanceMap[answers.main_blocker]}` })
  }

  // Ligne 4 — horizon (si urgent ou court)
  if (answers.timeline === "urgent") {
    lines.push({ icon: "⏱", text: "Horizon : Urgent — moins de 3 mois" })
  } else if (answers.timeline === "court") {
    lines.push({ icon: "⏱", text: "Horizon : 3 à 6 mois" })
  }

  return lines.slice(0, 4)
}
```

**Intégration** : Inséré dans `ResultsClient.tsx` entre le titre "Tes 5 meilleures opportunités" et la liste des cartes.

## Nouveau composant `ActionPlan`

### `src/components/features/results/ActionPlan.tsx` — nouveau

Affiché après les 5 cartes d'opportunités, avant le bloc coaching existant.

```
┌──────────────────────────────────────────────────┐
│  📋 Ton plan d'action                             │
│  ─────────────────────────────────────────────── │
│  1. Prépare maintenant : relevés de notes, CV     │
│     et une lettre de motivation type              │
│  2. Finalise ton dossier en ciblant la deadline   │
│     la plus proche                                │
│  3. Sauvegarde tes opportunités et active         │
│     les alertes deadline                          │
│                                                   │
│  [Être accompagné →]  [Accéder au Guide →]        │
└──────────────────────────────────────────────────┘
```

**Logique (3 étapes fixes) :**

```ts
function buildActionPlan(answers: TestAnswers, segment: Segment): string[] {
  const steps: string[] = []

  // Étape 1 — depuis main_blocker
  const step1Map: Record<string, string> = {
    information: "Explore les 5 opportunités ci-dessus et note celles qui t'intéressent",
    eligibilite: "Lis attentivement les critères d'éligibilité de chaque opportunité",
    documents: "Prépare maintenant : relevés de notes, CV et une lettre de motivation type",
    financement: "Concentre-toi sur les opportunités marquées 'financement complet'",
    confiance: "Choisis 1 opportunité qui te parle et lis les témoignages de lauréats",
  }
  steps.push(step1Map[answers.main_blocker] ?? "Explore les 5 opportunités et identifie celle qui te correspond le mieux")

  // Étape 2 — depuis dossier_maturity
  const step2Map: Record<string, string> = {
    debut: "Commence par rassembler tes relevés de notes et ton CV en 1 semaine",
    en_cours: "Finalise ton dossier en ciblant la deadline la plus proche",
    avance: "Peaufine ta lettre de motivation et vérifie chaque critère d'éligibilité",
    pret: "Tu es prêt à candidater — envoie ta candidature avant la deadline",
  }
  steps.push(step2Map[answers.dossier_maturity] ?? "Avance sur ton dossier pas à pas")

  // Étape 3 — depuis timeline + segment
  if (answers.timeline === "urgent") {
    steps.push("Il te reste peu de temps — priorise les opportunités avec deadline dans les 90 jours")
  } else if (segment === "Explorer") {
    steps.push("Améliore ton dossier pendant 2 mois, puis reviens tester ton profil mis à jour")
  } else {
    steps.push("Sauvegarde tes opportunités et active les alertes deadline pour ne rien rater")
  }

  return steps
}
```

**Les CTAs** réutilisent les liens existants : `/coaching` et `/guide-premium`.

## Wording questionnaire

### `src/data/questions.ts`

Mise à jour du champ `text` de chaque question et des `label` des options concernées.

Aucun changement de `value`, d'`id`, ni de structure — compatibilité totale avec le scoring et le matching existants.

| Question ID | text actuel | text optimisé |
|---|---|---|
| `origin_country` | "De quel pays viens-tu ?" | "Tu viens de quel pays ?" |
| `current_level` | "Quel est ton niveau actuel ?" | "Tu es en quelle année d'études en ce moment ?" |
| `main_objective` | "Quel est ton objectif principal ?" | "Quel type d'opportunité tu recherches ?" |
| `domain` | "Dans quel domaine veux-tu évoluer ?" | "Dans quel domaine tu étudies ou veux étudier ?" |
| `target_country` | "Dans quel pays ou quelle zone veux-tu évoluer ?" | "Tu vises quel pays ou quelle région ?" |
| `budget` | "Quel budget peux-tu mobiliser pour ton projet ?" | "Tu peux mettre combien pour financer ton projet ?" |
| `academic_level` | "Quel est ton dernier diplôme obtenu ou en cours ?" | "Quel est ton dernier diplôme (obtenu ou en train de valider) ?" |
| `dossier_maturity` | "Où en es-tu dans la préparation de ton dossier ?" | "Ton dossier de candidature, il en est où ?" |
| `main_blocker` | "Quel est ton principal blocage aujourd'hui ?" | "Qu'est-ce qui t'empêche d'avancer aujourd'hui ?" |
| `timeline` | "Quel est ton horizon de départ ou de démarrage ?" | "Tu voudrais partir ou commencer dans combien de temps ?" |

Options clés mises à jour (uniquement les labels, valeurs inchangées) :
- `budget.zero` → "Zéro budget — je cherche uniquement des opportunités 100% financées"
- `main_blocker.confiance` → "J'ai besoin d'être guidé — je ne sais pas par où commencer"
- `main_blocker.documents` → "Je ne sais pas quels documents préparer ni comment"
- `dossier_maturity.debut` → "Je commence tout juste — je n'ai rien préparé"
- `dossier_maturity.pret` → "Mon dossier est complet et prêt à envoyer"

## Décisions

- **`FeasibilityScore` non exposé à l'utilisateur directement** : il alimente les justifications enrichies mais n'est pas affiché en tant que score numérique — trop technique pour le MVP.
- **Pas de nouveau filtre sur `competitiveness_level`** : ce champ n'est pas encore systématiquement renseigné dans le catalogue (149 opportunités) — appliquer une pénalité pourrait vider des résultats valides.
- **`KraakDiagnostic` affiché même avec 0 résultat** : le diagnostic doit rester visible pour expliquer pourquoi aucune opportunité n'a été trouvée.
- **`ActionPlan` masqué si 0 opportunité** : les CTA coaching/guide sont déjà dans l'empty state existant — duplication inutile.
- **Pas de réécriture des tests existants** : les 113 tests du matcher doivent passer. Le filtre budget=zero et les nouveaux bonus sont couverts par de nouveaux tests.
