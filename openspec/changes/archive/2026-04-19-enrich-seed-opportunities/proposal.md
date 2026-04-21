## Why

Le seed d'opportunités actuel (10 entrées) laisse 3 profils sur 5 sans paywall (bac, bac2, doctorat) et aucune opportunité dans la catégorie `emploi`, rendant la validation MVP impossible pour une part significative des utilisateurs cibles. De plus, deux bugs de valeurs (`funding_type` et catégorie `echange`) corrompent silencieusement le matching, et les données riches déjà présentes dans le schéma Payload (`short_description`, `source_url`, `eligibility_summary`) ne sont ni exposées dans le type TypeScript ni affichées dans l'interface.

## What Changes

- **Fix bug A** : aligner la valeur canonique `funding_type` entre le seed, le schéma Payload et les labels de la `RecommendationCard` (`"partial"` → valeur unique partout)
- **Fix bug B** : ajouter l'option `{ label: "Échange", value: "echange" }` dans le champ `category` de la collection Payload
- Ajouter `short_description`, `source_url` et `eligibility_summary` (optionnels) au type `Opportunity` et à `fetchOpportunities()`
- Afficher `short_description` et un bouton "Postuler →" (`source_url`) dans `RecommendationCard`
- Étendre le seed de 10 à ~30 opportunités réelles avec descriptions, couvrant tous les niveaux (`bac`, `bac2`, `licence`, `master`, `doctorat`) et toutes les catégories (`bourse`, `formation`, `echange`, `stage`, `emploi`)

## Capabilities

### New Capabilities
- `opportunity-data`: Seed enrichi (~30 entrées), champs riches exposés dans le type et affichés dans la card — couverture complète des profils utilisateur

### Modified Capabilities
- `results-display`: La `RecommendationCard` affiche désormais une description courte et un lien de candidature — enrichissement de l'affichage sans changement des règles de scoring ou de paywall

## Impact

- `src/data/seed-opportunities.ts` : remplacement complet (10 → ~30 entrées avec nouveaux champs)
- `src/types/scoring.ts` : ajout de 3 champs optionnels à `Opportunity`
- `src/lib/opportunities.ts` : mapping des nouveaux champs depuis l'API Payload
- `src/components/features/results/RecommendationCard.tsx` : affichage `short_description` + bouton `source_url`
- `src/collections/Opportunities.ts` : ajout option `echange` + alignement `funding_type`
- Aucune migration Prisma — aucun changement de schéma DB métier
- Aucune modification du moteur de matching ni du scoring
