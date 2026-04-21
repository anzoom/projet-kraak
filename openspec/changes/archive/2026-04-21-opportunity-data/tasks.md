## 1. Nettoyer les entrées [TEST] du seed

- [x] 1.1 Dans `src/data/seed-opportunities.ts`, supprimer les 12 entrées dont l'`id` commence par `"test-stfr-"` (lignes ajoutées pour les tests manuels du matching engine)
- [x] 1.2 Vérifier que les tests Vitest du matcher (`src/domain/matching/matcher.test.ts`) n'utilisent pas ces IDs — si oui, remplacer par des opportunités inline dans les fixtures de test

## 2. Vérifier la couverture par niveau d'étude

- [x] 2.1 Compter les entrées actives par `study_level` : `bac`, `bac2`, `licence`, `master`, `doctorat` (les entrées `tous` comptent pour tous)
- [x] 2.2 Pour chaque niveau avec moins de 3 entrées actives, ajouter les opportunités manquantes avec `short_description`, `source_url` et `eligibility_summary` renseignés
- [x] 2.3 Vérifier qu'il y a au moins 3 opportunités actives de catégorie `emploi` pour les niveaux `licence`, `master` et `tous`

## 3. Vérifier l'alignement des valeurs canoniques

- [x] 3.1 Rechercher toute occurrence de `funding_type: "none"` dans `src/data/seed-opportunities.ts` — remplacer par `"non_financee"`
- [x] 3.2 Vérifier que `FUNDING_LABELS` dans `src/components/features/results/RecommendationCard.tsx` couvre bien `"non_financee"` — ajouter `non_financee: "Sans financement"` si absent

## 4. Garantir les champs riches dans le seed

- [x] 4.1 Parcourir `src/data/seed-opportunities.ts` et identifier toute entrée sans `source_url`
- [x] 4.2 Pour chaque entrée sans `source_url`, ajouter une URL officielle vérifiée ou marquer l'entrée `is_active: false` si l'URL n'est pas trouvable
- [x] 4.3 Même vérification pour `short_description` (≤ 280 caractères) et `eligibility_summary`

## 5. Ajouter le CTA "Postuler →" sur la RecommendationCard

- [x] 5.1 Dans `src/components/features/results/RecommendationCard.tsx`, sous le bouton "Voir les détails", ajouter :
  ```tsx
  {opportunity.source_url && (
    <a
      href={opportunity.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
    >
      Postuler <ArrowRight className="w-4 h-4" />
    </a>
  )}
  ```
- [x] 5.2 Ajuster le bouton "Voir les détails" pour avoir un style secondaire (border) lorsque "Postuler →" est présent

## 6. Vérification

- [x] 6.1 Lancer `npx tsc --noEmit` — zéro erreur TypeScript
- [x] 6.2 Lancer `npx vitest run` — zéro régression dans les 46 tests du matcher (57/57 passent)
- [ ] 6.3 Test manuel : ouvrir `/results` avec un profil `bac`, vérifier ≥ 3 recommandations et le bouton "Postuler →" actif
- [ ] 6.4 Test manuel : ouvrir `/results` avec un profil `doctorat`, vérifier ≥ 3 recommandations
- [ ] 6.5 Vérifier manuellement 3 URLs `source_url` choisies au hasard — s'assurer qu'elles sont actives et pointent vers la bonne page
