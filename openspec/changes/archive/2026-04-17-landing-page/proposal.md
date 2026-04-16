## Why

La landing page est le premier point de contact avec les utilisateurs de KRAAK — sans elle, aucun parcours utilisateur ne peut démarrer. Elle doit convaincre un étudiant africain (16–28 ans) en moins de 10 secondes que KRAAK peut lui trouver des opportunités personnalisées, et l'amener à cliquer sur "Tester mon profil".

## What Changes

- Remplacement de la page d'accueil placeholder (`src/app/page.tsx`) par la landing page KRAAK complète
- Mise à jour des métadonnées globales (`layout.tsx`) pour KRAAK
- Mise à jour des styles globaux (`globals.css`) : suppression du mode sombre (hors scope MVP), palette KRAAK
- Création des composants de sections réutilisables dans `src/components/features/landing/`

## Capabilities

### New Capabilities

- `landing-page` : Page d'accueil publique avec hero, bénéfices, fonctionnement, réassurance et CTA — optimisée mobile-first pour les réseaux africains

### Modified Capabilities

_(aucune — premier MVP, pas de specs existantes)_

## Impact

- `src/app/page.tsx` : fichier entièrement réécrit
- `src/app/layout.tsx` : métadonnées mises à jour
- `src/app/globals.css` : variables CSS KRAAK, suppression dark mode
- `src/components/features/landing/` : nouveaux composants de section
- Aucune dépendance back-end requise (page statique Server Component)
- Aucune migration de base de données
