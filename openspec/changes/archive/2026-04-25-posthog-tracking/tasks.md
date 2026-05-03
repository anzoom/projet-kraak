## Tasks

- [x] Installer `posthog-js` via npm
- [x] Créer `src/components/PostHogProvider.tsx` (Client Component avec init PostHog)
- [x] Wrapper `src/app/(app)/layout.tsx` avec PostHogProvider
- [x] Ajouter `NEXT_PUBLIC_POSTHOG_KEY` et `NEXT_PUBLIC_POSTHOG_HOST` dans `.env.local` (valeurs vides pour dev)
- [x] Capturer `test_started` dans `TestStepper` au montage du premier step
- [x] Capturer `test_completed` dans `TestStepper` à la soumission du dernier step
- [x] Capturer `results_viewed` dans `ResultsClient` après calcul des recommandations
- [x] Capturer `opportunity_clicked` dans `RecommendationCard` au clic "Voir les détails"
- [x] Capturer `opportunity_source_clicked` dans `RecommendationCard` au clic "Postuler →"
- [x] Capturer `coaching_cta_clicked` dans `CoachingUpsell` sur chaque CTA
