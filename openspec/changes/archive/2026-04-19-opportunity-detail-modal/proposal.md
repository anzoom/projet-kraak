## Why

L'ancienne `RecommendationCard` affichait un lien "Postuler →" directement sur la carte, sans aucune information sur la démarche à suivre, les documents requis ni les conditions d'éligibilité. Les utilisateurs arrivaient sur le site officiel sans préparation, ce qui augmente le taux d'abandon et réduit la pertinence perçue de KRAAK.

Les champs `eligibility_summary`, `short_description` et `source_url` sont déjà présents dans le type `Opportunity` mais insuffisamment exploités. L'objectif est d'intercaler un écran de détail avant l'action de candidature, pour préparer l'utilisateur et renforcer la valeur perçue de la plateforme.

## What Changes

- Le bouton "Postuler →" est retiré de la carte et déplacé dans un modal de détail.
- Un bouton "Voir les détails" (style secondaire, pleine largeur) est ajouté en bas de chaque `RecommendationCard`.
- Un composant `OpportunityDetailModal` (bottom sheet mobile / modal centré desktop) est créé, affichant :
  - Titre, catégorie, pays
  - Badges : type de financement, deadline (en orange), budget requis si applicable
  - Section **Présentation** (`short_description` complète)
  - Section **Conditions d'éligibilité** (`eligibility_summary`)
  - Section **Démarche de candidature** : 5 étapes générées selon la catégorie (`bourse`, `formation`, `echange`, `stage`, `emploi`)
  - Bouton CTA **"Postuler sur le site officiel →"** en pied de modal

## Capabilities

### New Capabilities
- `results-display` : modal de détail opportunité avec présentation, éligibilité, démarche par catégorie et CTA candidature

## Impact

- `src/components/features/results/RecommendationCard.tsx` : converti en client component, ajout état `showDetail`, description tronquée à 2 lignes, bouton "Voir les détails"
- `src/components/features/results/OpportunityDetailModal.tsx` : nouveau composant client (bottom sheet / modal)
- Aucun changement de type, de schéma DB ni de logique de scoring
