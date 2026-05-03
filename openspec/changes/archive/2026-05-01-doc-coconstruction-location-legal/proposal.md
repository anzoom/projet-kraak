## Why

Trois séries de développements livrés le 2026-04-30 / 2026-05-01 ne sont pas encore reflétés dans la documentation du projet (PRD, specs OpenSpec) :

1. **Coconstruction du catalogue** — L'empty state de la page résultats et le bas de la liste de recommandations invitent désormais les utilisateurs à contribuer en signalant des opportunités hors catalogue. Ce mécanisme participe à l'enrichissement continu du catalogue et renforce l'engagement communautaire, mais il n'est décrit nulle part dans le PRD ni dans les specs.

2. **Champ `location` sur les opportunités** — Un champ texte optionnel `location` (pays précis) a été ajouté à la collection Payload CMS, au type TypeScript et au fetch. Il est affiché dans la modale de détail. Ce champ ne figure pas dans la liste des champs minimaux de l'opportunité (PRD §11.2) ni dans les specs `opportunity-data`.

3. **Pages légales et contact adaptées à la phase bêta** — Les pages `/contact`, `/confidentialite` et `/conditions` ont été refondues pour être cohérentes avec le statut bêta gratuite (suppression des références au paiement, reformulation juridique, section "Fonctionnalités à venir" mise à jour). Ces changements éditoriaux n'ont pas d'équivalent documentaire.

Sans mise à jour, la documentation diverge du code livré, ce qui rend la maintenance et l'onboarding futurs plus difficiles.

## What Changes

- **PRD.md** — Ajout d'une section coconstruction dans les exigences fonctionnelles (§7), champ `location` dans les champs minimaux Opportunity (§11.2), mise à jour du catalogue (132 → 149 opportunités dans ARCHITECTURE.md §3.8).
- **`openspec/specs/results-display/spec.md`** — Mise à jour du scenario "Catalogue vide" + ajout des requirements et scenarios coconstruction (empty state et bloc bas de page).
- **`openspec/specs/opportunity-data/spec.md`** — Ajout du requirement champ `location` optionnel.

## Capabilities

### Modified Capabilities

- `results-display` : Ajout de deux points d'entrée coconstruction (empty state + bas de liste) et affichage du badge `location` dans la modale de détail.
- `opportunity-data` : Nouveau champ `location` (texte, optionnel) — purement informatif, sans impact sur le matching.

## Impact

- Aucun changement de code (tout est déjà livré).
- Mise à jour documentaire pure : PRD.md, ARCHITECTURE.md, deux specs OpenSpec.
