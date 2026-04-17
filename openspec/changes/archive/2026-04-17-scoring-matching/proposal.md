## Why

Les réponses du questionnaire sont stockées dans localStorage mais ne produisent aucune valeur tant qu'elles ne sont pas transformées en profil scoré et en recommandations. Le moteur de scoring et de matching est le cœur métier de KRAAK : sans lui, pas de résultats personnalisés, pas de paywall, pas de revenus. Il doit être implémenté en TypeScript pur, totalement déterministe et couvert par des tests unitaires Vitest.

## What Changes

- Création du moteur de scoring : `TestResponse → UserProfileScore` (3 scores : académique, financier, maturité + segment global)
- Création du moteur de matching : `UserProfileScore + Opportunity[] → Recommendation[]` (filtrage + tri par pertinence)
- Règles de scoring externalisées dans `rules.ts` (modifiables sans toucher au moteur)
- Tests Vitest unitaires sur les deux moteurs
- Route API `POST /api/scoring` : reçoit les réponses, calcule le score, persiste en base
- Route API `POST /api/matching` : reçoit un `score_id`, récupère le score en base, retourne les recommandations triées

## Capabilities

### New Capabilities

- `scoring-engine` : Moteur TypeScript pur transformant les réponses du test en `UserProfileScore` (3 sous-scores + segment), avec règles configurables et résultat déterministe
- `matching-engine` : Moteur TypeScript pur produisant une liste de `Recommendation[]` triée par `match_score` à partir d'un `UserProfileScore` et d'un catalogue d'`Opportunity[]`

### Modified Capabilities

_(aucune)_

## Impact

- `src/domain/scoring/rules.ts` — règles de scoring (déjà scaffoldé vide)
- `src/domain/scoring/scorer.ts` — moteur (déjà scaffoldé vide)
- `src/domain/scoring/scorer.test.ts` — tests Vitest
- `src/domain/matching/matcher.ts` — moteur (déjà scaffoldé vide)
- `src/domain/matching/matcher.test.ts` — tests Vitest
- `src/app/api/scoring/route.ts` — route API (déjà scaffoldée)
- `src/app/api/matching/route.ts` — route API (déjà scaffoldée)
- Dépendance Prisma : lecture/écriture `UserProfileScore` et `Recommendation`
- Dépendance Payload CMS : lecture `Opportunity[]` depuis la base CMS pour le matching
