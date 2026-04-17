### Requirement: Filtrage des opportunités inactives
Le moteur SHALL exclure toute opportunité dont `is_active = false` avant de calculer le score de pertinence.

#### Scenario: Opportunité inactive exclue
- **WHEN** une opportunité a `is_active = false`
- **THEN** elle n'apparaît pas dans les `Recommendation[]` retournées

#### Scenario: Opportunité active incluse
- **WHEN** une opportunité a `is_active = true`
- **THEN** elle est éligible au calcul de score de pertinence

### Requirement: Filtrage par niveau d'études incompatible
Le moteur SHALL exclure une opportunité si son `study_level` est incompatible avec la réponse `academic_level` de l'utilisateur, sauf si `study_level = "tous"`.

#### Scenario: Niveau compatible retenu
- **WHEN** `opportunity.study_level = "licence"` et `answers.academic_level = "licence"`
- **THEN** l'opportunité est éligible

#### Scenario: Niveau incompatible exclu
- **WHEN** `opportunity.study_level = "doctorat"` et `answers.academic_level = "bac"`
- **THEN** l'opportunité est exclue du résultat

#### Scenario: study_level tous accepté
- **WHEN** `opportunity.study_level = "tous"`
- **THEN** l'opportunité est éligible quel que soit `academic_level`

### Requirement: Pénalité budget insuffisant
Le moteur SHALL appliquer une pénalité de -30 au `match_score` si `opportunity.budget_required` dépasse le budget maximum de l'utilisateur, sans exclure l'opportunité.

#### Scenario: Budget insuffisant pénalisé non exclu
- **WHEN** `opportunity.budget_required` excède le budget max utilisateur
- **THEN** l'opportunité reste dans les résultats avec `match_score` réduit de 30

### Requirement: Score de pertinence additif
Le moteur SHALL calculer un `match_score` additif selon ces critères : catégorie correspond à `main_objective` (+30), domaine contient le domaine utilisateur (+25), pays correspond à `target_country` ou `funding_type = "complete"` pour "peu_importe" (+20), `funding_type = "complete"` quand `budget = "zero"` (+15), deadline dans les 90 prochains jours (+10).

#### Scenario: Correspondance catégorie
- **WHEN** `opportunity.category = answers.main_objective`
- **THEN** `match_score` reçoit +30

#### Scenario: Correspondance domaine par mots-clés normalisés
- **WHEN** le domaine de l'opportunité contient le mot-clé normalisé du domaine utilisateur (insensible à la casse, sans accents)
- **THEN** `match_score` reçoit +25

#### Scenario: Correspondance pays
- **WHEN** `opportunity.country = answers.target_country`
- **THEN** `match_score` reçoit +20

#### Scenario: Financement complet pour budget zéro
- **WHEN** `opportunity.funding_type = "complete"` et `answers.budget = "zero"`
- **THEN** `match_score` reçoit +15

#### Scenario: Deadline dans 90 jours
- **WHEN** `opportunity.deadline` est dans les 90 prochains jours à partir de la date d'exécution
- **THEN** `match_score` reçoit +10

#### Scenario: Deadline dépassée exclue de bonus
- **WHEN** `opportunity.deadline` est antérieure à la date d'exécution
- **THEN** aucun bonus deadline n'est accordé

### Requirement: Tri des recommandations par match_score décroissant
Le moteur SHALL retourner les `Recommendation[]` triées par `match_score` décroissant. Les opportunités avec le même score conservent leur ordre relatif d'entrée.

#### Scenario: Tri correct
- **WHEN** trois opportunités ont `match_score` 75, 45 et 90
- **THEN** l'ordre retourné est 90, 75, 45

### Requirement: Génération de justification textuelle
Chaque `Recommendation` SHALL inclure un champ `justification` : une chaîne concise listant les critères ayant le plus contribué au score.

#### Scenario: Justification non vide
- **WHEN** une opportunité obtient un `match_score > 0`
- **THEN** `justification` est une chaîne non vide décrivant au moins un critère de correspondance

#### Scenario: Justification score zéro
- **WHEN** une opportunité obtient `match_score = 0`
- **THEN** `justification` peut indiquer qu'aucun critère ne correspond

### Requirement: Route API POST /api/matching
La route SHALL accepter `{ score: ScoringOutput, opportunities?: Opportunity[] }`, appeler `matchOpportunities` et retourner `Recommendation[]` avec status 200. Elle ne MUST PAS persister en base. Elle retourne 400 si `score` est absent.

#### Scenario: Appel valide avec opportunités fournies
- **WHEN** `POST /api/matching` reçoit `{ score: ScoringOutput, opportunities: [...] }`
- **THEN** la réponse est 200 avec `Recommendation[]` triées par `match_score`

#### Scenario: Appel valide sans opportunités
- **WHEN** `POST /api/matching` reçoit `{ score: ScoringOutput }` sans `opportunities`
- **THEN** la réponse est 200 avec un tableau vide `[]`

#### Scenario: score absent
- **WHEN** `POST /api/matching` reçoit un body sans champ `score`
- **THEN** la réponse est 400
