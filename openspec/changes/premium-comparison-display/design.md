## Architecture

Aucune modification backend. Tous les changements sont côté UI (Server Components et Client Components existants).

Les métriques sont des constantes statiques — pas de fetch, pas d'état serveur. La grille de comparaison est un composant purement présentationnel.

## Composants

### `src/app/(app)/(public)/guide-premium/page.tsx` ✅ implémenté

Section de comparaison insérée entre le hero et la liste UPCOMING :

```
┌─────────────────┬─────────────────┐
│    GRATUIT      │    PREMIUM      │
│    Classic      │    Guide        │
│                 │                 │
│       5         │       20        │
│ recommandations │ recommandations │
├─────────────────┼─────────────────┤
│ ✓ Recommandations │ ✓ Recommandations ×4 │
│ ✗ Favoris       │ ✓ 15 favoris max│
│ ✗ Guide         │ ✓ 9 modules     │
│ ✗ Alertes       │ ✓ Alertes       │
└─────────────────┴─────────────────┘
```

Style : `grid grid-cols-2 gap-3` — colonne blanche (border-gray-100) + colonne orange (bg-primary). Checkmarks `lucide-react` (`Check` vert / `X` gris).

### `src/components/features/results/ResultsClient.tsx` — à implémenter

Bloc upgrade teaser affiché après le bouton "Voir les X autres opportunités →" pour les utilisateurs Classic authentifiés (`!isPremium && !showFavorites`).

Structure :
```
┌─────────────────────────────────────┐
│ 🚀 Passe en Premium                 │
│ Tu vois 5 oppos. Premium en donne   │
│ 20 — plus 15 favoris sauvegardables │
│                                     │
│  [Découvrir le Guide Premium →]     │
└─────────────────────────────────────┘
```

Style : `bg-primary/5 border-2 border-primary/20 rounded-2xl p-5` — discret, non bloquant.

### `src/components/features/landing/PremiumSection.tsx` — à implémenter

Ajout d'une ligne de métriques sous la description de la carte Guide Premium :

```
┌──────────────────────────────┐
│ 📚 Guide Premium             │
│ 9 modules … 20 recommandations│
│                              │
│  5 → 20    ·   +15 favoris  │ ← ligne métriques ajoutée
└──────────────────────────────┘
```

Style : petites chips `bg-white/10 text-white/60 text-[10px]` alignées horizontalement.

## Décisions

- **Pas de composant partagé** : la comparaison prend des formes trop différentes selon le contexte (2 colonnes sur guide-premium, teaser compact sur results, chips sur landing) — 3 implémentations inline.
- **Pas de lien direct vers le paiement** : le CTA pointe vers `/guide-premium` (liste d'attente), car le paiement Chariow n'est pas encore actif en Phase 1.
- **Teaser results non intrusif** : affiché après le contenu principal (après le bouton "Voir plus"), jamais au-dessus des recommandations.
