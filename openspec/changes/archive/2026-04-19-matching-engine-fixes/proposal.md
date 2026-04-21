## Why

Plusieurs bugs de cohérence rendaient les recommandations non pertinentes et non reproductibles lors de scénarios de test multiples avec le même compte utilisateur :

1. **Cache non invalidé** : `kraak_scoring_result` (localStorage) était relu en priorité même si les réponses du test avaient changé entre deux sessions, produisant toujours les mêmes recommandations.
2. **Formulaire non réinitialisé** : après déconnexion, le store Zustand (`kraak_anonymous_session`) conservait les réponses précédentes — le test redémarrait avec les données de la session antérieure.
3. **Filtres de matching trop permissifs** : catégorie, pays et domaine n'étaient que des critères de score (+bonus/-pénalité), non des filtres d'exclusion. Des opportunités hors catégorie, hors pays et hors domaine pouvaient remonter en tête des recommandations.
4. **Mismatch de valeur domaine** : la question "Arts, Design & Communication" produisait la valeur `arts_com`, incompatible avec la valeur `lettres_arts` utilisée dans les données seed — les utilisateurs de ce domaine n'obtenaient jamais de correspondance.

## What Changes

- **Cache invalidation** : `ResultsClient` lit d'abord les réponses de session, compare avec le cache avant de l'utiliser — re-scoring systématique si les réponses ont changé.
- **Reset formulaire** : `TestStepper` appelle `reset()` du store et supprime `kraak_scoring_result` à chaque montage — chaque visite sur `/test` repart à zéro.
- **Filtres durs matching** : ajout de trois filtres d'exclusion dans `matchOpportunities` — catégorie, domaine et pays sont maintenant des critères éliminatoires avant le scoring.
- **Alignement valeur domaine** : valeur `arts_com` → `lettres_arts` dans `questions.ts` pour correspondre aux données seed et Payload CMS.

## Capabilities

### Modified Capabilities
- `matching-engine` : filtres durs catégorie + domaine + pays ; scoring limité au classement des résultats déjà filtrés
- `profile-test` : réinitialisation systématique du store et du cache au chargement de la page test

## Impact

- `src/components/features/results/ResultsClient.tsx` : comparaison des réponses avant utilisation du cache
- `src/components/features/test/TestStepper.tsx` : appel `reset()` + suppression `kraak_scoring_result` au montage
- `src/domain/matching/matcher.ts` : trois filtres durs ajoutés, nettoyage du code mort (pénalité pays, scoring domaine conditionnel)
- `src/data/questions.ts` : valeur `arts_com` → `lettres_arts` pour la question domaine
- Aucune migration Prisma — aucun changement de schéma DB
