## Context

Le système actuel utilise un seed de 10 opportunités comme fallback quand Payload CMS est vide. Ce seed sert de source de données pour tous les tests utilisateur initiaux. Le type `Opportunity` est partagé entre le seed, l'API Payload et le moteur de matching — toute modification doit rester rétro-compatible avec les données existantes et le matcher inchangé.

Deux bugs silencieux existent : `funding_type: "partial"` dans le seed vs `"partielle"` dans le schéma Payload, et la catégorie `echange` absente des options Payload. Trois champs riches (`short_description`, `source_url`, `eligibility_summary`) sont définis dans Payload mais jamais transmis au frontend.

## Goals / Non-Goals

**Goals:**
- Couvrir tous les niveaux `academic_level` (bac, bac2, licence, master, doctorat) avec assez d'opportunités pour déclencher le paywall (>2 par profil)
- Couvrir toutes les catégories `main_objective` (bourse, formation, echange, stage, emploi)
- Exposer `short_description` et `source_url` dans la card pour augmenter la valeur perçue
- Corriger les deux bugs de valeurs sans casser le matching existant

**Non-Goals:**
- Modifier le moteur de matching ou le scoring
- Ajouter de nouveaux critères de filtrage
- Implémenter un système d'import CSV ou API externe
- Alimenter Payload CMS en base (le seed reste le fallback MVP)

## Decisions

### D1 — Valeur canonique `funding_type` : `"partial"` (pas `"partielle"`)

Le seed utilise `"partial"`, `FUNDING_LABELS` dans `RecommendationCard` utilise `"partial"` comme clé. Aligner le schéma Payload sur `"partial"` (au lieu de l'inverse) minimise les changements : seul le schéma Payload est modifié, le seed et la card restent cohérents.

Alternatif considéré : renommer en `"partielle"` partout → plus de fichiers touchés, risque de régression sur les données déjà saisies en Payload.

### D2 — Champs riches optionnels dans `Opportunity`

`short_description`, `source_url`, `eligibility_summary` sont ajoutés comme `string | null` optionnels. Le seed les renseigne sur toutes les entrées. Les données Payload existantes sans ces champs restent valides (le matcher les ignore, la card les affiche conditionnellement).

Alternatif considéré : type séparé `RichOpportunity` → complexité inutile, le matcher n'utilise pas ces champs donc leur présence dans le type est neutre.

### D3 — Seed structuré en blocs par niveau

Le seed sera organisé en blocs commentés par `academic_level` pour faciliter la maintenance et la lecture. ~30 entrées couvrant : 4 bac, 4 bac2, 6 licence, 8 master, 4 doctorat, 4 emploi (tous niveaux).

### D4 — Affichage `RecommendationCard` : description + bouton conditionnel

`short_description` affiché sous le titre en texte gris. Bouton "Postuler →" affiché uniquement si `source_url` est renseigné, en lien externe (`target="_blank" rel="noopener noreferrer"`). Pas d'iframe, pas de preview — lien direct vers la source officielle.

## Risks / Trade-offs

**[Données seed fictives perçues comme fausses]** → Les URLs `source_url` doivent pointer vers des pages réelles et actives. Utiliser uniquement des URLs de programmes officiels vérifiés.

**[Expiration des deadlines]** → Les deadlines codées en dur dans le seed deviendront passées avec le temps. Le matcher filtre les deadlines expirées silencieusement. Mitigation : utiliser des deadlines 2026–2027 pour le MVP, ajouter des entrées sans deadline pour les programmes récurrents.

**[Couverture `echange` dans le seed]** → La catégorie `echange` correspond à `main_objective: "echange"` dans le test. Le seed doit avoir assez d'entrées `category: "echange"` pour tous les niveaux pertinents (licence, master).
