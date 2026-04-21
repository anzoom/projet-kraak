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

### Requirement: Hard filter on country — cible "afrique hors pays d'origine"
Le moteur SHALL, lorsque `answers.target_country = "afrique"`, inclure uniquement les opportunités dont le `country` est `"afrique"` ou appartient à la liste des pays africains supportés, ET exclure les opportunités dont le `country` correspond au pays d'origine de l'utilisateur (`answers.origin_country`).

#### Scenario: Opportunité africaine hors pays d'origine retenue
- **WHEN** `answers.target_country = "afrique"` et `opportunity.country = "senegal"` et `answers.origin_country = "cameroun"`
- **THEN** l'opportunité est éligible et reçoit le bonus pays (+20)

#### Scenario: Opportunité pays d'origine exclue pour cible afrique
- **WHEN** `answers.target_country = "afrique"` et `opportunity.country = "cameroun"` et `answers.origin_country = "cameroun"`
- **THEN** l'opportunité est exclue (même pays que le pays d'origine)

#### Scenario: Opportunité générique afrique incluse
- **WHEN** `answers.target_country = "afrique"` et `opportunity.country = "afrique"`
- **THEN** l'opportunité est toujours éligible quel que soit le pays d'origine

#### Scenario: Pays africains supportés
- **WHEN** le filtrage "afrique" est appliqué
- **THEN** les pays reconnus comme africains sont : benin, burkina_faso, cameroun, cote_ivoire, guinee, mali, rdc, senegal, togo et la valeur générique "afrique"

### Requirement: Score de pertinence additif — classement uniquement
Le moteur SHALL calculer un `match_score` pour les opportunités ayant passé tous les filtres. Les critères : catégorie (+30), domaine (+25), pays (+20 si target_country spécifié, ou financement complet pour `peu_importe`), financement complet avec budget zéro (+15), deadline dans les 90 prochains jours (+10). Pénalité budget insuffisant (-30).

#### Scenario: Score additif sur résultats filtrés
- **WHEN** une opportunité passe tous les filtres durs
- **THEN** son `match_score` est la somme des critères applicables

#### Scenario: Pénalité budget insuffisant
- **WHEN** `opportunity.budget_required` excède le budget max utilisateur
- **THEN** `match_score` est réduit de 30 (l'opportunité reste visible)

### Requirement: Deadline dépassée exclue
Le moteur SHALL exclure les opportunités dont `deadline` est antérieure à la date d'exécution.

#### Scenario: Deadline dépassée exclue
- **WHEN** `opportunity.deadline` est dans le passé
- **THEN** l'opportunité est exclue

### Requirement: Tri des recommandations par match_score décroissant
Le moteur SHALL retourner les `Recommendation[]` triées par `match_score` décroissant.

#### Scenario: Tri correct
- **WHEN** trois opportunités ont `match_score` 75, 45 et 90
- **THEN** l'ordre retourné est 90, 75, 45

### Requirement: Génération de justification textuelle
Chaque `Recommendation` SHALL inclure un champ `justification` listant les critères ayant contribué au score (3 premiers critères maximum).

#### Scenario: Justification non vide
- **WHEN** une opportunité obtient un `match_score > 0`
- **THEN** `justification` est une chaîne non vide décrivant au moins un critère de correspondance
