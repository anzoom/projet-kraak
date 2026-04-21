## Context

La page `/results` est un client component (`ResultsClient.tsx`) qui lit le localStorage pour le scoring. Les opportunités sauvegardées peuvent donc être stockées dans le même localStorage sans infrastructure supplémentaire. L'état des favoris doit être partagé entre `RecommendationCard`, `OpportunityDetailModal` et `ResultsClient` — un hook custom `useSavedOpportunities` évite le prop drilling.

L'URL de partage pointe vers la landing page KRAAK avec un hash de l'ID d'opportunité (`https://kraak.co/?opp=<id>`) — suffisant pour le MVP, sans nécessiter de route dynamique `/opportunity/[id]`.

## Goals / Non-Goals

**Goals :**
- Icône signet sur chaque carte : toggle save/unsave, persiste en localStorage
- Compteur de favoris visible dans le header de résultats (ex: "★ 2 sauvegardées")
- Section "Mes favoris" collapsible/toggle en haut de la liste des recommandations (affichée seulement si ≥ 1 favori)
- Bouton "Partager" dans la modale : Web Share API sur mobile, copie URL dans presse-papier sur desktop avec toast de confirmation
- Zéro régression sur le parcours principal

**Non-Goals :**
- Synchronisation des favoris avec la base de données (hors scope MVP — localStorage suffit)
- Route dédiée `/opportunity/[id]` (hors scope — l'URL de partage pointe vers la landing)
- Notifications push pour les nouvelles opportunités (Phase 2)

## Decisions

### D1 — Hook `useSavedOpportunities` partagé
**Décision :** Créer `src/hooks/useSavedOpportunities.ts` — expose `{ savedIds, toggle, isSaved, count }`. Utilise `useState` + `useEffect` pour synchroniser avec `localStorage.getItem("kraak_saved_opportunities")` (JSON array of strings).
**Rationale :** Centralise la logique, évite la duplication entre Card et Modal. Pas besoin de Zustand ou Context pour une feature aussi simple.

### D2 — URL de partage : `window.location.origin + "/?opp=" + id`
**Décision :** L'URL partagée est `https://kraak.co/?opp=<opportunity-id>`. La landing page ne fait rien avec ce paramètre pour l'instant (MVP).
**Rationale :** Simple à générer côté client. La landing peut plus tard lire le paramètre pour afficher un CTA direct vers le test.

### D3 — Web Share API avec fallback clipboard
**Décision :** 
```ts
if (navigator.share) {
  navigator.share({ title: opportunity.title, url: shareUrl })
} else {
  navigator.clipboard.writeText(shareUrl)
  // afficher un toast "Lien copié !"
}
```
**Rationale :** Web Share est disponible sur iOS Safari et Android Chrome — couvre 90%+ du public cible (mobile africain). Le fallback clipboard couvre desktop.

### D4 — Toast de confirmation minimal
**Décision :** Utiliser un état local `copied: boolean` dans la modale avec un `setTimeout(1500ms)` pour afficher "✓ Lien copié !" sous le bouton. Pas de bibliothèque toast externe.
**Rationale :** Évite d'ajouter une dépendance (react-hot-toast, sonner) pour une interaction ponctuelle.

### D5 — Section favoris : filtre toggle, pas un onglet séparé
**Décision :** Un bouton toggle "★ Mes favoris (N)" en haut de la liste dans `ResultsClient`. Si actif, affiche uniquement les cards sauvegardées. Sinon, affiche toutes les recommandations.
**Rationale :** Plus simple qu'un système d'onglets. Évite de créer un nouveau composant de layout. Invisible si count === 0.

## Risks / Trade-offs

- **Perte des favoris** : localStorage est effacé si l'utilisateur vide son cache ou change d'appareil. Acceptable pour le MVP — à résoudre en Phase 2 avec sync DB.
- **Hydration mismatch** : l'icône signet peut flasher au chargement (localStorage lu après hydration). Résoudre avec `isMounted` guard dans le hook.
- **Web Share API Safari** : peut nécessiter un geste utilisateur direct — le clic sur le bouton suffit.

## Migration Plan

1. Créer `src/hooks/useSavedOpportunities.ts`
2. Créer `src/components/features/results/SaveButton.tsx`
3. Intégrer `SaveButton` dans `RecommendationCard`
4. Ajouter le bouton "Partager" dans `OpportunityDetailModal`
5. Ajouter le toggle favoris dans `ResultsClient`
6. Tests Playwright : save/unsave, partage clipboard, section favoris
