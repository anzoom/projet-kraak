## Architecture du modal

### RecommendationCard (client component)

Converti de server component en client component pour gérer l'état `showDetail: boolean`.

- Description tronquée à 2 lignes (`line-clamp-2`) sur la carte
- Bouton "Voir les détails" : `border-2 border-primary`, pleine largeur
- `{showDetail && <OpportunityDetailModal ... />}` monté conditionnellement

### OpportunityDetailModal

Overlay fixe `z-50` avec deux zones :
- **Backdrop** : `bg-black/50 backdrop-blur-sm`, fermeture au clic
- **Sheet** : `rounded-t-3xl sm:rounded-2xl`, `max-h-[90dvh]`, scroll interne

Comportements :
- `document.body.style.overflow = "hidden"` pendant ouverture (bloque le scroll page)
- Fermeture : clic backdrop | bouton × | touche Escape
- Pas de dépendance à une bibliothèque de modal externe

### Étapes de candidature par catégorie

Mapping statique `APPLICATION_STEPS: Record<string, string[]>` — 5 étapes par catégorie :
- `bourse` : éligibilité → dossier → formulaire → soumission → suivi
- `formation` : prérequis → dossier → tests → inscription → démarches
- `echange` : accord inter-universitaire → validation pédagogique → dossier → dépôt → formalités
- `stage` : CV/LM → candidature → entretien → convention → visa si besoin
- `emploi` : CV/LM → candidature en ligne → entretiens → contrat → visa si besoin

Fallback sur `bourse` si catégorie inconnue.
