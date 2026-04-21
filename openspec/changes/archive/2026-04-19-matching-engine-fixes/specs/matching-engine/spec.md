## MODIFIED Requirements

### Requirement: Hard filter on category
Le moteur SHALL exclure toute opportunité dont `category` ne correspond pas exactement à `answers.main_objective` (comparaison normalisée insensible à la casse et aux accents).

#### Scenario: Catégorie correspondante retenue
- **WHEN** `opportunity.category = "bourse"` et `answers.main_objective = "bourse"`
- **THEN** l'opportunité est éligible au scoring

#### Scenario: Catégorie non correspondante exclue
- **WHEN** `opportunity.category = "emploi"` et `answers.main_objective = "bourse"`
- **THEN** l'opportunité est exclue, même si elle cumule un score élevé sur d'autres critères

### Requirement: Hard filter on domain
Le moteur SHALL exclure toute opportunité dont `domain` ne correspond pas exactement à `answers.domain` (comparaison normalisée).

#### Scenario: Domaine correspondant retenu
- **WHEN** `opportunity.domain = "commerce"` et `answers.domain = "commerce"`
- **THEN** l'opportunité est éligible

#### Scenario: Domaine non correspondant exclu
- **WHEN** `opportunity.domain = "sciences_tech"` et `answers.domain = "commerce"`
- **THEN** l'opportunité est exclue

#### Scenario: Pas de filtre si domaine non renseigné
- **WHEN** `answers.domain` est absent ou vide
- **THEN** aucun filtre domaine n'est appliqué

### Requirement: Hard filter on country
Le moteur SHALL exclure toute opportunité dont `country` ne correspond pas à `answers.target_country`, sauf si `target_country = "peu_importe"`.

#### Scenario: Pays correspondant retenu
- **WHEN** `opportunity.country = "france"` et `answers.target_country = "france"`
- **THEN** l'opportunité est éligible et reçoit le bonus pays (+20)

#### Scenario: Pays non correspondant exclu
- **WHEN** `opportunity.country = "afrique"` et `answers.target_country = "france"`
- **THEN** l'opportunité est exclue

#### Scenario: Peu importe — filtre désactivé
- **WHEN** `answers.target_country = "peu_importe"`
- **THEN** aucun filtre pays n'est appliqué ; les opportunités à financement complet reçoivent le bonus pays (+20)

### Requirement: Score de pertinence — critères de classement uniquement
Le moteur SHALL calculer un `match_score` uniquement pour les opportunités ayant passé tous les filtres. Les critères de score sont : catégorie (+30, toujours appliqué après filtrage), domaine (+25, toujours appliqué après filtrage), pays (+20 si `target_country` spécifié ou financement complet pour `peu_importe`), financement complet avec budget zéro (+15), deadline dans les 90 prochains jours (+10). Pénalité budget insuffisant (-30).

#### Scenario: Score additif sur résultats filtrés
- **WHEN** une opportunité passe tous les filtres durs
- **THEN** son `match_score` est la somme des critères applicables

#### Scenario: Pénalité budget
- **WHEN** `opportunity.budget_required` excède le budget max de l'utilisateur
- **THEN** `match_score` est réduit de 30 (l'opportunité reste visible)
