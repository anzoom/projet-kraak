## Why

Un utilisateur qui trouve une opportunité pertinente veut pouvoir :
1. **La retrouver plus tard** sans refaire le test — surtout sur mobile où l'on consulte les résultats en déplacement
2. **La partager** à un proche (famille, mentor, camarade) pour avoir un avis ou les informer

Actuellement, les résultats sont volatils : si l'utilisateur ferme l'onglet ou vide son localStorage, il perd ses recommandations. Sans mécanisme de sauvegarde, le taux de retour et la rétention sont faibles.

## What Changes

- Ajout d'un bouton **"Sauvegarder"** (icône signet/étoile) sur chaque `RecommendationCard` — enregistre l'ID de l'opportunité dans le localStorage
- Ajout d'un bouton **"Partager"** dans le pied de la `OpportunityDetailModal` — déclenche `navigator.share()` sur mobile, copie l'URL enrichie dans le presse-papier sur desktop
- Ajout d'une section **"Mes favoris"** filtrée dans la page `/results` : affiche les opportunités sauvegardées en haut de liste (tab ou filtre toggle)
- Un compteur de favoris dans le header de la page résultats

## Capabilities

### New Capabilities
- `opportunity-save` : sauvegarde locale des opportunités via localStorage (`kraak_saved_opportunities`)
- `opportunity-share` : partage via Web Share API ou clipboard avec URL du site + ID de l'opportunité

### Modified Capabilities
- `results-display` : section "Mes favoris" en haut de `/results`, compteur de favoris dans le header

## Impact

- Nouveau composant : `src/components/features/results/SaveButton.tsx`
- Nouveau hook : `src/hooks/useSavedOpportunities.ts`
- Modification : `src/components/features/results/RecommendationCard.tsx` — intégrer `SaveButton`
- Modification : `src/components/features/results/OpportunityDetailModal.tsx` — bouton "Partager"
- Modification : `src/components/features/results/ResultsClient.tsx` — section favoris
