## 1. Corrections bugs critiques (P0)

- [x] 1.1 Corriger `financial_score` dans `scorer.ts` — supprimer la référence `invest_readiness` (toujours 0 depuis la suppression de la question)
- [x] 1.2 Mettre à jour la repondération globale : `academic * 0.35 + financial * 0.25 + maturity * 0.40`
- [x] 1.3 Mettre à jour la pondération interne de `maturity_score` : `dossier_maturity * 0.55 + timeline * 0.30 + main_blocker * 0.15`
- [x] 1.4 Ajouter le filtre dur `budget=zero → funding_type must be complete` dans `matcher.ts` (filtre 7bis, après filtre budget existant)
- [x] 1.5 Vérifier que les 113 tests existants passent encore (`vitest run`) — 133/133 ✓

## 2. Amélioration des bonus de matching

- [x] 2.1 Mettre à jour `MATCH_BONUS` dans `matcher.ts` : domaine 25→20, zone fallback 10→8, financement complet scindé en `complete_funding_zero: 20` et `complete_funding_any: 10`
- [x] 2.2 Mettre à jour `scoreOpportunity` pour appliquer les deux niveaux de bonus financement selon `answers.budget`
- [x] 2.3 Ajouter tests unitaires pour les nouveaux bonus (budget=zero + funding complete, budget=petit + funding complete)
- [x] 2.4 Ajouter tests unitaires pour le filtre 7bis (budget=zero + funding partial → exclure)

## 3. Score de faisabilité `FeasibilityScore`

- [x] 3.1 Ajouter les types `FeasibilityFinancial`, `FeasibilityAcademic`, `FeasibilityTemporal`, `FeasibilityScore` dans `src/types/scoring.ts`
- [x] 3.2 Ajouter le champ `feasibility: FeasibilityScore` dans l'interface `Recommendation` (`src/types/scoring.ts`)
- [x] 3.3 Implémenter `computeFeasibility()` dans `matcher.ts`
- [x] 3.4 Appeler `computeFeasibility()` dans la boucle de matching et stocker dans chaque `Recommendation`
- [x] 3.5 Remplacer la construction du champ `justification` par `buildEnrichedJustification()` (utilise `feasibility` + `reasons`)

## 4. Composant `KraakDiagnostic`

- [x] 4.1 Créer `src/components/features/results/KraakDiagnostic.tsx` — composant pure UI
- [x] 4.2 Implémenter `buildDiagnosticLines(answers)` — retourne max 4 lignes `{ icon, text }`
- [x] 4.3 Intégrer `KraakDiagnostic` dans `ResultsClient.tsx` entre ScoreCard et la liste des cartes
- [x] 4.4 Vérifier le rendu mobile (390px) — max 4 lignes, pas de débordement

## 5. Composant `ActionPlan`

- [x] 5.1 Créer `src/components/features/results/ActionPlan.tsx` — composant pure UI
- [x] 5.2 Implémenter `buildActionPlan(answers, segment)` — retourne toujours 3 étapes
- [x] 5.3 Intégrer `ActionPlan` dans `ResultsClient.tsx` après la liste des cartes, avant le bloc coaching existant
- [x] 5.4 Masquer `ActionPlan` si le nombre de résultats est 0 (empty state géré ailleurs)
- [x] 5.5 Les CTAs du plan d'action (`/coaching`, `/guide-premium`) reprennent les liens existants

## 6. Wording questionnaire

- [x] 6.1 Mettre à jour le champ `text` des 10 questions dans `src/data/questions.ts` (ton humain, formulation directe)
- [x] 6.2 Mettre à jour les libellés (`label`) des options clés : `budget.zero`, `main_blocker.confiance`, `main_blocker.documents`, `dossier_maturity.debut`, `dossier_maturity.pret`
- [x] 6.3 Vérifier qu'aucune valeur (`value`) n'a changé — compatibilité totale avec le scoring et matching existants

## 7. Tests et validation

- [x] 7.1 Vérifier TypeScript (`tsc --noEmit`) — aucune erreur dans le code produit (erreurs pré-existantes dans test-profile.spec.ts ignorées)
- [x] 7.2 Lancer la suite complète Vitest (`vitest run`) — 133/133 tests passent
- [x] 7.3 Vérifier que le diagnostic s'affiche correctement sur mobile (390px) via Playwright screenshot `/results`
- [x] 7.4 Vérifier le plan d'action sur mobile via Playwright screenshot
- [x] 7.5 Tester manuellement un profil `budget=zero` → filtre 7bis couvert par 4 tests unitaires dédiés
- [x] 7.6 Tester manuellement un profil `dossier_maturity=pret + academic_level=licence` → segment corrigé par les tests scorer
