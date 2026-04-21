## Context

Le seed actuel (`src/data/seed-opportunities.ts`) contient ~194 entrées dont 12 sont des entradas `[TEST]` explicitement créées pour le développement manuel. Les vraies données doivent pointer vers des programmes existants (Erasmus+, Bourse Eiffel, DAAD, etc.) avec des URLs HTTPS vérifiées. Le CSV template `kraak-opportunities-template.csv` déjà préparé définit la structure d'import souhaitée.

Le Payload CMS ne contient que 3 opportunités réelles en base. Les opportunités sont servies via `src/lib/opportunities.ts` qui merge les données Payload et le seed — le seed reste donc la source principale jusqu'à ce que le back-office soit pleinement alimenté.

## Goals / Non-Goals

**Goals :**
- Seed avec ≥ 3 opportunités réelles par `study_level` (bac, bac2, licence, master, doctorat, tous)
- Seed avec ≥ 3 opportunités de catégorie `emploi`
- Chaque entrée du seed renseigne `short_description`, `source_url` et `eligibility_summary`
- La `RecommendationCard` affiche un CTA "Postuler →" cliquable si `source_url` est présent
- Alignement `funding_type` : valeurs acceptées = `complete | partial | non_financee | salariee`

**Non-Goals :**
- Migration Payload CMS (hors scope — le seed est la source de vérité pour l'instant)
- Scraping ou collecte automatisée d'URLs
- Traduction en anglais des données

## Decisions

### D1 — Seed comme source de vérité provisoire
**Décision :** Conserver `seed-opportunities.ts` comme catalogue principal jusqu'à ce que Payload CMS soit alimenté via import CSV.
**Rationale :** Permet de livrer rapidement sans configuration d'import. La structure est identique — la migration vers Payload sera un simple import futur.

### D2 — Bouton "Postuler →" conditionnel
**Décision :** Dans `RecommendationCard`, ajouter un bouton "Postuler →" (`<a href={source_url} target="_blank" rel="noopener noreferrer">`) affiché uniquement si `opportunity.source_url` est truthy. Il remplace (ou est placé à côté de) le bouton "Voir les détails".
**Rationale :** L'URL officielle est l'action principale souhaitée par l'utilisateur. "Voir les détails" reste pour la modal interne.

### D3 — Nettoyage des entrées [TEST]
**Décision :** Supprimer les 12 entrées `{ id: "test-stfr-*" }` du seed en production. Les conserver éventuellement dans un fichier `seed-test-data.ts` séparé importé uniquement dans les tests Vitest.
**Rationale :** Ces entrées sont toutes `bourse / sciences_tech / france / licence` — elles biaisent les résultats pour les utilisateurs avec d'autres profils.

### D4 — Couverture minimale par niveau
**Décision :** Garantir au moins 3 entrées avec `is_active: true` pour chaque valeur de `study_level` : `bac`, `bac2`, `licence`, `master`, `doctorat`. Les entrées `tous` comptent pour tous les niveaux.
**Rationale :** Le paywall (qui requiert ≥ 3 résultats pour se déclencher) doit fonctionner pour tous les profils — pas seulement pour les étudiants en licence.

### D5 — Valeur `academic_level` dans le matcher
**Décision :** Le matcher utilise `normalizeStudyLevel()` pour convertir `bac3 → licence` et `bac5 → master`. Le seed utilisera directement les valeurs normalisées (`licence`, `master`) pour éviter la double conversion.
**Rationale :** Le seed bypasse Payload, donc la normalisation Payload ne s'applique pas. La cohérence est plus simple en utilisant les valeurs déjà normalisées.

## Risks / Trade-offs

- **URLs non vérifiées** : les URLs des programmes doivent être testées manuellement — des liens morts détruisent la confiance utilisateur.
- **Données périmées** : les deadlines et conditions d'éligibilité changent chaque année. Prévoir une revue saisonnière (janvier + juillet).
- **Biais de couverture** : le seed actuel est surreprésenté en `sciences_tech / france / licence` — rééquilibrer vers `commerce`, `sante`, `afrique`, `bac`.

## Migration Plan

1. Supprimer les 12 entrées `[TEST]` du seed (ou les déplacer dans un fichier de test séparé)
2. Vérifier la couverture par `study_level` — compléter si un niveau a moins de 3 entrées actives
3. Vérifier que toutes les entrées ont `short_description`, `source_url` et `eligibility_summary`
4. Vérifier que `funding_type` n'utilise pas `"none"` (remplacer par `"non_financee"`)
5. Ajouter le CTA "Postuler →" dans `RecommendationCard`
6. Lancer les tests Vitest — zéro régression attendue
7. Test manuel : vérifier 3 URLs source_url choisies au hasard sont bien actives
