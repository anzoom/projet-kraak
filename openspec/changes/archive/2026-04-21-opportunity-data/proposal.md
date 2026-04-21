## Why

Le catalogue d'opportunités actuel repose sur des données de démonstration (`seed-opportunities.ts`) qui ne sont pas des vraies opportunités vérifiées. Pour valider la proposition de valeur de KRAAK auprès d'utilisateurs réels, les recommandations doivent pointer vers des programmes existants avec des URLs officielles, des descriptions précises et des conditions d'éligibilité réelles.

Par ailleurs, le modèle freemium (pivot V2) mise sur la pertinence perçue des recommandations pour convertir les utilisateurs en comptes. Des données factices brisent cette confiance dès la première visite.

## What Changes

- Remplacement des entrées de seed fictives par des opportunités réelles et vérifiées, structurées selon le schéma `Opportunity`
- Ajout du bouton "Postuler →" sur la `RecommendationCard` lorsque `source_url` est renseigné
- Correction de l'alignement des valeurs canoniques : `funding_type: "none"` → `"non_financee"` dans le seed pour correspondre aux libellés de la card
- Nettoyage des 12 entrées `[TEST]` du seed (conservées uniquement en développement local)
- Couverture garantie : ≥ 3 opportunités éligibles par `academic_level` (bac, bac2, licence, master, doctorat) et ≥ 3 par catégorie `emploi`

## Capabilities

### Modified Capabilities
- `results-display` : la `RecommendationCard` affiche un bouton "Postuler →" si `source_url` est présent
- `opportunity-data` : seed remplacé par des opportunités réelles couvrant tous les profils

## Impact

- Modification : `src/data/seed-opportunities.ts` — remplacement des données fictives par des vraies
- Modification : `src/components/features/results/RecommendationCard.tsx` — ajout du CTA "Postuler →"
- Vérification : `src/collections/Opportunities.ts` — s'assurer que `funding_type: "none"` est absent (utiliser `"non_financee"`)
