## Why

L'abandonnement du paywall a libéré des emplacements dans la page des résultats, désormais utilisés pour l'upsell coaching. Deux lacunes restaient à adresser :

1. **Contournement du quota** : un utilisateur non premium pouvait modifier ses critères de test pour obtenir un nouveau jeu de 5 opportunités à chaque rechargement, vidant le mécanisme de limitation de tout sens.
2. **Absence de pipeline d'intérêt pour les services à venir** (visa, voyage) : ces services potentiellement à forte valeur n'avaient aucun point de collecte d'intent dans l'application.

En parallèle, plusieurs ajustements de la logique de matching et du formulaire de test ont été réalisés pour améliorer la couverture des profils aux domaines indécis et des opportunités à portée mondiale.

## What Changes

- **Nouveau** : Mécanisme de verrouillage du quota par IDs (`kraak_free_quota_ids` en localStorage) — modifier les critères ne débloque plus un nouveau jeu d'opportunités
- **Nouveau** : Composant `BetaServicesTeaser.tsx` — deux cartes de collecte d'email bêta (Visa et Voyage) affichées après les recommandations dans `/results`
- **Nouveau** : Composant `BetaGuideTeaser.tsx` — carte teaser Guide KRAAK extraite de `ResultsClient` en fichier autonome
- **Nouveau** : Option "Autre domaine — je n'ai pas encore décidé" (`value: "autre"`) dans la question domaine du test
- **Modifié** : Matcher — `answers.domain = "autre"` désactive le filtre domaine (comme `multidisciplinaire`)
- **Modifié** : Matcher — `opportunity.country = "international"` passe toujours le filtre pays
- **Modifié** : Page `/coaching` — 4 offres en 2 sections ("Conseil individuel" : Audit + Accompagnement ; "Services pratiques" : Visa + Voyage)
- **Modifié** : Landing `PremiumSection` — grille 2×2 avec 4 cartes (Guide, Coaching, Visa, Voyage) en thèmes alternés
- **Modifié** : Texte CTA hero — "Tester mon profil" → "Voir mes résultats en < 1 min"
- **Modifié** : `WaitlistForm.INTERESTS` — ajout des intérêts `visa` et `voyage`

## Capabilities

### New Capabilities

- `free-results-access` : Verrouillage du quota de résultats par identifiants d'opportunités (anti-contournement)
- `results-display` : Collecte d'intérêt bêta pour les services Visa et Voyage via `BetaServicesTeaser`

### Modified Capabilities

- `matching-engine` : Gestion du domaine "autre" et des opportunités "international"
- `profile-test` : Option de domaine "autre"
- `coaching` : Extension à 4 offres avec Visa et Voyage
- `landing-page` : Section offres 4 services + CTA "Voir mes résultats en < 1 min"
- `posthog-tracking` : Nouvel événement `beta_service_interest`, propriété `quota_exhausted` sur `results_viewed`

## Impact

- **Fichiers modifiés** : `src/components/features/results/ResultsClient.tsx`, `src/domain/matching/matcher.ts`, `src/data/questions.ts`, `src/app/(app)/(public)/coaching/page.tsx`, `src/components/features/landing/PremiumSection.tsx`, `src/components/features/waitlist/WaitlistForm.tsx`
- **Nouveaux fichiers** : `src/components/features/results/BetaServicesTeaser.tsx`, `src/components/features/results/BetaGuideTeaser.tsx`
- **Tests E2E mis à jour** : `tests/e2e/freemium-auth-gate.spec.ts`, `tests/e2e/landing.spec.ts`, `tests/e2e/opportunity-alerts.spec.ts`
- **Pas de migration DB** : toutes les modifications sont frontend / logique client
