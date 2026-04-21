## 1. Créer le hook useSavedOpportunities

- [x] 1.1 Créer `src/hooks/useSavedOpportunities.ts` :
  - Clé localStorage : `"kraak_saved_opportunities"` (JSON array de strings)
  - Exposer : `{ savedIds: string[], toggle(id: string): void, isSaved(id: string): boolean, count: number }`
  - Guard `isMounted` pour éviter le hydration mismatch (lire localStorage uniquement après montage)

## 2. Créer le composant SaveButton

- [x] 2.1 Créer `src/components/features/results/SaveButton.tsx` :
  - Props : `opportunityId: string`
  - Utilise `useSavedOpportunities`
  - Icône `Bookmark` (Lucide) — remplie si sauvegardée (`fill-current`), vide sinon
  - Aria-label : "Sauvegarder cette opportunité" / "Retirer des favoris"
  - Animation légère au clic (scale)
  - Style : bouton ghost, taille `w-9 h-9`, rounded-full

## 3. Intégrer SaveButton dans RecommendationCard

- [x] 3.1 Dans `src/components/features/results/RecommendationCard.tsx`, ajouter `SaveButton` dans le header de la carte :
  - Positionner le `SaveButton` à côté du badge `#rank` (en haut à droite)
  - Remplacer le `span` `#rank` par un `div` flex contenant `#rank` + `SaveButton`

## 4. Ajouter le bouton Partager dans OpportunityDetailModal

- [x] 4.1 Dans `src/components/features/results/OpportunityDetailModal.tsx`, ajouter dans le footer (après "Postuler sur le site officiel") :
  - Bouton "Partager cette opportunité" avec icône `Share2` (Lucide)
  - Logique : `navigator.share()` si disponible, sinon `navigator.clipboard.writeText(shareUrl)`
  - `shareUrl` = `` `${window.location.origin}/?opp=${opportunity.id}` ``
  - État local `copied: boolean` + `setTimeout(1500)` pour reset
  - Si `copied`, afficher "✓ Lien copié !" à la place du label normal
  - Style secondaire (border-2 border-gray-200)

## 5. Ajouter le toggle favoris dans ResultsClient

- [x] 5.1 Dans `src/components/features/results/ResultsClient.tsx`, dans le bloc `status === "ready"` :
  - Utiliser `useSavedOpportunities`
  - Afficher un bouton toggle `"★ Mes favoris (N)"` au-dessus de la liste — visible seulement si `count > 0`
  - État local `showFavorites: boolean`
  - Si `showFavorites`, filtrer `free` pour n'afficher que les recommandations dont `isSaved(rec.opportunity.id) === true`
  - Si aucun favori sauvegardé ne correspond aux recommandations actuelles, afficher un message vide "Aucune opportunité sauvegardée pour ce profil."

## 6. Vérification

- [x] 6.1 Lancer `npx tsc --noEmit` — zéro erreur TypeScript
- [x] 6.2 Lancer `npx vitest run` — zéro régression
- [x] 6.3 Test manuel : sauvegarder une opportunité, vérifier que l'icône se remplit + section favoris apparaît
- [x] 6.4 Test manuel : actualiser la page — vérifier que les favoris persistent
- [x] 6.5 Test manuel : bouton Partager — vérifier le toast "Lien copié !" sur desktop
