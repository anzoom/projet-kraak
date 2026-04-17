## Context

Les fichiers `scorer.ts`, `rules.ts` et `matcher.ts` sont déjà scaffoldés (TODO) dans `src/domain/`. Les routes API `/api/scoring` et `/api/matching` existent mais renvoient 501. La collection Payload CMS `Opportunity` est définie avec tous les champs nécessaires. L'auth Supabase n'est pas encore implémentée : les routes API seront complètes mais l'intégration JWT sera branchée lors du prochain feature (auth).

## Goals / Non-Goals

**Goals:**
- Implémenter `computeScore()` : `TestAnswers → { academic_score, financial_score, maturity_score, segment }` — déterministe et pur
- Implémenter `matchOpportunities()` : `score + opportunities → Recommendation[]` triées par `match_score`
- Externaliser les règles dans `rules.ts` (modifiables sans toucher au moteur)
- Tests Vitest exhaustifs sur les deux moteurs (cas nominaux + cas limites)
- Routes API `POST /api/scoring` et `POST /api/matching` fonctionnelles (stub JWT pour l'instant)

**Non-Goals:**
- Intégration JWT Supabase (fait dans le prochain feature auth)
- Persistance Prisma `UserProfileScore` / `Recommendation` (dépend de la DB configurée — les routes appellent les moteurs mais ne font pas encore la persistance)
- Interface utilisateur des résultats (feature suivante)

## Decisions

### D1 — Algorithme de scoring par pondération simple

**Scores sur 100, calculés à partir des réponses aux 10 questions :**

**Score académique** (40% du score global) :
- `current_level` : lycee=20, licence_1_2=40, licence_3=60, master=80, diplome=70
- `academic_level` : bac=20, bac2=40, licence=60, master=80, doctorat=100
- Moyenne des deux valeurs

**Score financier** (30% du score global) :
- `budget` : zero=20, petit=40, moyen=70, confortable=100
- `invest_readiness` : oui_certain=100, peut_etre=60, non_gratuit=30, non_certain=10
- Pondération : budget × 0.7 + invest_readiness × 0.3

**Score de maturité** (30% du score global) :
- `dossier_maturity` : debut=10, en_cours=40, avance=70, pret=100
- `timeline` : urgent=90, court=70, moyen=50, long=30
- `main_blocker` : confiance=70, documents=60, eligibilite=50, financement=40, information=30
- Moyenne des trois valeurs

**Segment global** (basé sur `academic × 0.4 + financial × 0.3 + maturity × 0.3`) :
- `Explorer` : score < 40
- `Candidat` : score 40–69
- `Finaliste` : score ≥ 70

### D2 — Algorithme de matching par score additionnel (0–100)

Pour chaque opportunité active :

1. **Filtres d'exclusion** (score = 0 si non passé) :
   - `is_active = false` → exclue
   - `study_level` incompatible avec `academic_level` répondu → exclue (sauf si `study_level = "tous"`)
   - `budget_required` > budget max de l'utilisateur → déprioritisée (non exclue, mais -30)

2. **Score de pertinence additif** :
   - Catégorie correspond à `main_objective` : +30
   - Domaine contient le domaine de l'utilisateur : +25
   - Pays correspond à `target_country` (ou funding_type=complete pour "peu_importe") : +20
   - `funding_type = complete` quand `budget = zero` : +15
   - Deadline dans les 90 jours (urgence) : +10

3. **Justification** : générée comme string concise à partir des critères ayant le plus contribué.

### D3 — Routes API : stub sans persistance Prisma

Les routes `/api/scoring` et `/api/matching` appellent les moteurs de domaine mais ne persistenten pas encore en base (Prisma non configuré localement). Elles retournent le résultat calculé directement. La persistance sera branchée lors de l'intégration auth (feature suivante).

`/api/scoring` attend : `{ answers: TestAnswers }` → retourne `ScoringOutput`
`/api/matching` attend : `{ score: ScoringOutput, opportunities?: Opportunity[] }` → retourne `Recommendation[]`

### D4 — Types partagés dans `src/types/`

Les types `Opportunity` (version simplifiée pour le moteur, pas le CMS complet) et `ScorerInput`/`MatchInput` enrichis sont définis dans `src/types/scoring.ts` pour être réutilisables par les routes API et les composants de résultats.

## Risks / Trade-offs

- **[Risque] Règles subjectives** → Mitigation : les poids sont dans `rules.ts`, facilement ajustables après A/B tests
- **[Risque] Faux positifs sur le domaine** (matching textuel libre) → Mitigation : comparaison par mots-clés normalisés plutôt que strict equality
- **[Risque] Pas de persistance = pas d'historique** → Mitigation : les moteurs sont purs, la persistance s'ajoute sans changer les fonctions

## Open Questions

- Le score doit-il être recalculé à chaque visite `/results` ou mis en cache ? (Mis en cache via Prisma dès que l'auth est en place)
- Faut-il pénaliser les opportunités dont la deadline est dépassée ? (Oui — filter `deadline > now()` dans le matcher)
