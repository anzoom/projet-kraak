## Context

Les développements du 2026-04-30 / 2026-05-01 ont ajouté trois fonctionnalités au produit sans mise à jour documentaire simultanée. Ce change est une mise à jour documentaire pure — aucune modification de code n'est requise.

## Goals / Non-Goals

**Goals :**
- Aligner PRD.md avec les fonctionnalités livrées (coconstruction, champ `location`, pages légales bêta).
- Mettre à jour les specs OpenSpec `results-display` et `opportunity-data`.
- Corriger les chiffres obsolètes dans ARCHITECTURE.md (132 → 149 opportunités).

**Non-Goals :**
- Modifier le code applicatif.
- Documenter les pages légales dans les specs OpenSpec (contenu éditorial, pas de logique métier testable).

## Decisions

### D1 — Coconstruction dans le PRD : nouvelle section §7.10

La coconstruction est un mécanisme d'engagement utilisateur distinct du matching et du coaching. Elle mérite une section propre dans les exigences fonctionnelles, après le bloc coaching (§7.5) et les mécanismes de rétention (§7.8). Deux points d'entrée sont documentés séparément : l'empty state (zéro recommandation) et le bloc bas de liste (résultats présents).

### D2 — Champ `location` : ajout dans §11.2 uniquement

Le champ `location` est purement informatif — il n'influence pas le matching. Il est ajouté à la liste des champs Opportunity (§11.2) avec la mention "optionnel, purement informatif". Aucune règle métier nouvelle n'est nécessaire en §12.

### D3 — Spec `results-display` : mise à jour in-place

Le scenario "Catalogue vide — message dédié" est remplacé par un scenario plus précis ("Aucune opportunité correspondant au profil"). Deux nouveaux requirements sont ajoutés à la suite : "Bloc coconstruction en empty state" et "Bloc coconstruction en bas de liste". Pas de refonte de la spec.

### D4 — Spec `opportunity-data` : ajout d'un requirement à la fin

Le requirement `location` est ajouté après les requirements existants, sans modifier la logique de seed ou de matching déjà documentée.

### D5 — ARCHITECTURE.md §3.8 : correction du compteur

La section 3.8 mentionne "132 opportunités actives (2026-04-24)" — corrigé en "149 opportunités actives (2026-04-28)" pour correspondre au chiffre du PRD §11.3.
