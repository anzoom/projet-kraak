## Why

Sans tracking analytics, il est impossible de valider les hypothèses du MVP KRAAK :
- Est-ce que les utilisateurs complètent le test de profil ?
- Est-ce que les recommandations sont pertinentes (clics sur les opportunités) ?
- Est-ce que le CTA coaching convertit ?

Le PRD (section 9.1) liste les événements produit à instrumenter dès le MVP. Sans ces KPIs, l'équipe pilote à l'aveugle.

## What Changes

- **Installation PostHog** : `posthog-js` installé côté client
- **Provider PostHog** : composant `PostHogProvider` wrappant l'app avec `NEXT_PUBLIC_POSTHOG_KEY`
- **Événements test** : `test_started` (premier step) et `test_completed` (step 10 soumis)
- **Événements résultats** : `results_viewed` avec propriétés segment et scores ; `opportunity_clicked` au clic "Voir les détails" ; `opportunity_source_clicked` au clic "Postuler →"
- **Événement coaching** : `coaching_cta_clicked` au clic sur les CTAs CoachingUpsell

## Capabilities

### Modified Capabilities
- `landing-page` : PostHogProvider wrappant le layout app
- `results-display` : événements `results_viewed`, `opportunity_clicked`, `opportunity_source_clicked`
- `profile-test` : événements `test_started`, `test_completed`

## Impact

- `package.json` : ajout de `posthog-js`
- `src/components/PostHogProvider.tsx` : nouveau composant client
- `src/app/(app)/layout.tsx` : wrapping avec PostHogProvider
- `src/components/features/test/TestStepper.tsx` : capture `test_started` et `test_completed`
- `src/components/features/results/ResultsClient.tsx` : capture `results_viewed`
- `src/components/features/results/RecommendationCard.tsx` : capture `opportunity_clicked` et `opportunity_source_clicked`
- `src/components/features/results/CoachingUpsell.tsx` : capture `coaching_cta_clicked`
- Aucune migration Prisma — aucun changement de schéma DB
