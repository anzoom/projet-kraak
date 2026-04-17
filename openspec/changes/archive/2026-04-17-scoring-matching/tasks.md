## 1. Types partagés

- [x] 1.1 Créer `src/types/scoring.ts` avec les types `ScoringOutput`, `Segment`, `Opportunity` (version moteur simplifiée), `Recommendation`, `MatchInput`

## 2. Règles de scoring

- [x] 2.1 Implémenter `SCORING_RULES` dans `src/domain/scoring/rules.ts` : tables de correspondance pour `current_level`, `academic_level`, `budget`, `invest_readiness`, `dossier_maturity`, `timeline`, `main_blocker`

## 3. Moteur de scoring

- [x] 3.1 Implémenter `computeScore(answers: TestAnswers): ScoringOutput` dans `src/domain/scoring/scorer.ts` : calcul des 3 sous-scores + score global + segment
- [x] 3.2 Créer `src/domain/scoring/scorer.test.ts` : tests Vitest couvrant les cas nominaux (Explorer/Candidat/Finaliste), les frontières (score=40, score=70) et les réponses inconnues

## 4. Moteur de matching

- [x] 4.1 Implémenter `matchOpportunities(input: MatchInput): Recommendation[]` dans `src/domain/matching/matcher.ts` : filtres d'exclusion (is_active, study_level, deadline dépassée) + score additif (+30/+25/+20/+15/+10) + pénalité budget (-30) + tri décroissant + génération de justification
- [x] 4.2 Créer `src/domain/matching/matcher.test.ts` : tests Vitest couvrant les filtres d'exclusion, chaque critère additif, la pénalité budget, le tri et la génération de justification

## 5. Routes API

- [x] 5.1 Implémenter `src/app/api/scoring/route.ts` : valider `{ answers }`, appeler `computeScore`, retourner 200 + ScoringOutput ou 400 si body invalide
- [x] 5.2 Implémenter `src/app/api/matching/route.ts` : valider `{ score, opportunities? }`, appeler `matchOpportunities`, retourner 200 + Recommendation[] ou 400 si `score` absent
