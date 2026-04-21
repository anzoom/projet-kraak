## MODIFIED Requirements

### Requirement: Affichage des recommandations libres
La page SHALL afficher les 2 premières `Recommendation[]` (triées par `match_score` décroissant) avec : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, justification, description courte (si disponible), et un lien de candidature (si `source_url` défini).

#### Scenario: Deux recommandations libres visibles
- **WHEN** le matching produit au moins 2 recommandations
- **THEN** les 2 premières sont affichées complètement sans verrouillage

#### Scenario: Moins de 2 recommandations disponibles
- **WHEN** le matching produit 0 ou 1 recommandation
- **THEN** seules les disponibles sont affichées, sans erreur

#### Scenario: Catalogue vide — message dédié
- **WHEN** aucune opportunité n'est disponible (ni Payload ni seed)
- **THEN** la page affiche un message "Catalogue en cours de construction" sans erreur

#### Scenario: Description courte affichée dans la card
- **WHEN** une recommandation a un champ `short_description` non nul
- **THEN** ce texte est affiché sous le titre de l'opportunité dans la card

#### Scenario: Bouton Postuler affiché si source_url présent
- **WHEN** une recommandation a un champ `source_url` non nul
- **THEN** un bouton "Postuler →" est affiché et pointe vers cette URL en nouvel onglet

#### Scenario: Bouton Postuler absent si source_url manquant
- **WHEN** une recommandation n'a pas de `source_url`
- **THEN** aucun bouton de candidature n'est affiché, sans erreur

### Requirement: Source des opportunités avec fallback seed
Le server component SHALL récupérer les opportunités actives depuis l'API Payload CMS. Si l'appel échoue ou retourne zéro opportunités, il SHALL utiliser les données de `src/data/seed-opportunities.ts`.

#### Scenario: Opportunités chargées depuis Payload CMS
- **WHEN** Payload CMS est disponible et contient des opportunités actives
- **THEN** le matching utilise ces opportunités réelles

#### Scenario: Fallback sur seed si Payload indisponible
- **WHEN** l'appel à l'API Payload CMS échoue (réseau, DB non configurée)
- **THEN** les opportunités du seed enrichi sont utilisées pour le matching sans erreur côté utilisateur
