## 1. Corrections de bugs (valeurs canoniques)

- [x] 1.1 Dans `src/collections/Opportunities.ts` : remplacer `{ label: "Partielle", value: "partielle" }` par `{ label: "Partielle", value: "partial" }` dans les options du champ `funding_type`
- [x] 1.2 Dans `src/collections/Opportunities.ts` : ajouter `{ label: "Échange", value: "echange" }` dans les options du champ `category`
- [x] 1.3 Vérifier que `FUNDING_LABELS` dans `RecommendationCard.tsx` a bien la clé `"partial"` (et non `"partielle"`) — corriger si nécessaire

## 2. Extension du type Opportunity et du fetcher

- [x] 2.1 Dans `src/types/scoring.ts` : ajouter `short_description?: string | null`, `source_url?: string | null`, `eligibility_summary?: string | null` à l'interface `Opportunity`
- [x] 2.2 Dans `src/lib/opportunities.ts` : mettre à jour l'interface `PayloadDoc` avec les 3 nouveaux champs et les mapper dans `fetchOpportunities()` (`short_description`, `source_url`, `eligibility_summary`)

## 3. Enrichissement de la RecommendationCard

- [x] 3.1 Dans `RecommendationCard.tsx` : afficher `opportunity.short_description` sous le titre (texte gris `text-slate-mid text-sm`, conditionnel si non nul)
- [x] 3.2 Dans `RecommendationCard.tsx` : afficher un bouton/lien "Postuler →" si `opportunity.source_url` est défini — lien `<a href={source_url} target="_blank" rel="noopener noreferrer">`

## 4. Seed enrichi (~30 opportunités)

- [x] 4.1 Remplacer le contenu de `src/data/seed-opportunities.ts` par le seed enrichi avec les blocs par niveau :
  - 4 opportunités `study_level: "bac"` (prépas africaines, L1, concours)
  - 4 opportunités `study_level: "bac2"` (licences pro, passerelles, formations courtes)
  - 6 opportunités `study_level: "licence"` (variété pays et domaines)
  - 8 opportunités `study_level: "master"` (bourses internationales, stages, emplois)
  - 4 opportunités `study_level: "doctorat"` (TWAS, Humboldt, Chine, UA)
  - 4 opportunités `study_level: "tous"` dont 3+ de catégorie `emploi`
- [x] 4.2 Vérifier que chaque entrée seed a `short_description` (≤ 280 caractères), `source_url` (URL HTTPS vérifiée) et `eligibility_summary`
- [x] 4.3 Vérifier que les deadlines sont toutes en 2026–2027 ou `null` (jamais expirées au moment des tests)
- [x] 4.4 Vérifier la couverture : pour chaque combinaison `academic_level` × `main_objective` principale, au moins 3 opportunités passent le filtre `isStudyLevelCompatible`

## 5. Vérification et tests

- [x] 5.1 Lancer le serveur local (`npm run dev`) et simuler le parcours complet pour un profil `bac` : test → résultats → vérifier que le paywall apparaît
- [x] 5.2 Simuler le parcours pour un profil `bac2` et vérifier le paywall
- [x] 5.3 Simuler le parcours pour un profil `doctorat` et vérifier le paywall
- [x] 5.4 Simuler un profil `main_objective: "emploi"` et vérifier que des recommandations apparaissent
- [x] 5.5 Vérifier l'affichage de `short_description` et du bouton "Postuler →" dans la card
- [x] 5.6 Vérifier qu'une opportunité `funding_type: "partial"` affiche bien "Financement partiel" (pas la valeur brute)
- [x] 5.7 Lancer `npm run typecheck` — aucune erreur TypeScript
