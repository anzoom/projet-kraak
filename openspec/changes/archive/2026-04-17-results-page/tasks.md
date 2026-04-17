## 1. Données de seed et types

- [x] 1.1 Créer `src/data/seed-opportunities.ts` : 10 opportunités de démonstration couvrant différents segments (bourses, formations, programmes), pays, domaines et niveaux d'études
- [x] 1.2 Ajouter `normalizeStudyLevel()` dans `src/types/scoring.ts` ou un helper dédié : mapper les valeurs Payload CMS (`bac3`, `bac5`) vers les valeurs moteur (`licence`, `master`)

## 2. Fetch opportunités côté serveur

- [x] 2.1 Créer `src/lib/opportunities.ts` : fonction `fetchOpportunities()` qui appelle `GET /api/opportunities?where[is_active][equals]=true&limit=50` et retourne `Opportunity[]`, avec fallback sur les données seed en cas d'erreur ou de résultat vide

## 3. Composant ResultsClient

- [x] 3.1 Supprimer `src/components/features/results/ResultsStub.tsx`
- [x] 3.2 Créer `src/components/features/results/ResultsClient.tsx` (Client Component) : lit `kraak_scoring_result` et `kraak_anonymous_session` depuis localStorage, calcule le score via `/api/scoring` si absent, importe `matchOpportunities` directement, affiche le spinner de chargement
- [x] 3.3 Créer `src/components/features/results/ScoreCard.tsx` : affiche segment (badge coloré), sous-scores (3 colonnes), score global
- [x] 3.4 Créer `src/components/features/results/RecommendationCard.tsx` : affiche titre, pays, catégorie, deadline, type de financement, justification pour une opportunité libre
- [x] 3.5 Créer `src/components/features/results/PaywallSection.tsx` : affiche cartes verrouillées (overlay), compteur, proposition de valeur, prix (2 500 FCFA), CTA vers `/payment`

## 4. Page résultats

- [x] 4.1 Mettre à jour `src/app/(public)/results/page.tsx` : appeler `fetchOpportunities()` côté serveur, passer les opportunités en props à `ResultsClient`
