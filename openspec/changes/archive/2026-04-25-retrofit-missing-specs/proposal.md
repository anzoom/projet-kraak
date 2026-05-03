## Why

Plusieurs fonctionnalités ont été implémentées sans passer par le workflow OpenSpec (propose → apply → archive), ou en passant par des changes archivés sans spec formelle. Le catalogue `openspec/specs/` est donc désynchronisé de l'état réel du produit :

- **7 fonctionnalités sans spec** : coaching, save/share opportunités, tableau de bord utilisateur, alertes opportunités, tracking PostHog, opportunités expirées, fondations projet
- **1 spec obsolète** : `results-paywall` documente un modèle freemium abandonné (pivot vers accès libre + coaching payant)
- **6 specs projet-fondations** présentes dans le change actif `project-foundations` mais non synchronisées vers `openspec/specs/`

Sans documentation à jour, il devient difficile de comprendre les invariants métier, de planifier les évolutions, et d'éviter les régressions lors de refactoring.

## What Changes

Rétrofit de la documentation OpenSpec pour aligner `openspec/specs/` sur l'état implémenté :

- **Créer** `coaching/spec.md` : page des offres, tunnel de réservation, composant CoachingUpsell dans les résultats
- **Créer** `opportunity-save/spec.md` : SaveButton, hook `useSavedOpportunities`, persistance localStorage
- **Créer** `user-dashboard/spec.md` : page protégée `/dashboard`, affichage du profil utilisateur
- **Créer** `opportunity-alerts/spec.md` : préférences d'alertes utilisateur, cron job `/api/cron/send-alerts`
- **Créer** `posthog-tracking/spec.md` : PostHogProvider, liste des événements capturés, règles de capture
- **Créer** `expired-opportunities/spec.md` : règles d'affichage des opportunités périmées selon l'horizon utilisateur
- **Mettre à jour** `results-paywall/spec.md` → remplacée par `free-results-access/spec.md` : accès libre aux résultats, pivot freemium abandonné
- **Synchroniser** les specs de `project-foundations` vers `openspec/specs/`

## Capabilities

### New Capabilities
- `coaching` : offres de coaching, réservation de créneaux, upsell dans les résultats
- `opportunity-save` : sauvegarde locale des opportunités favorites
- `user-dashboard` : tableau de bord personnel (route protégée)
- `opportunity-alerts` : alertes email sur les nouvelles opportunités
- `posthog-tracking` : catalogue des événements analytics
- `expired-opportunities` : règles de visibilité et UX des opportunités périmées
- `free-results-access` : accès libre aux résultats (remplace le paywall)

### Modified Capabilities
- `results-paywall` : marquée comme remplacée (spec conservée pour historique, remplacée par `free-results-access`)

## Impact

Aucune modification de code — uniquement création et mise à jour de fichiers `spec.md` dans `openspec/specs/`.
