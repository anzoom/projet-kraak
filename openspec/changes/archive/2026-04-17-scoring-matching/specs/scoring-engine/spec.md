## ADDED Requirements

### Requirement: Calcul du score académique
Le moteur SHALL calculer un score académique sur 100 à partir des réponses `current_level` et `academic_level` selon les tables de correspondance définies dans `rules.ts`. Le score est la moyenne arithmétique des deux valeurs mappées.

#### Scenario: Score académique lycéen avec bac
- **WHEN** `current_level = "lycee"` et `academic_level = "bac"`
- **THEN** le score académique vaut (20 + 20) / 2 = 20

#### Scenario: Score académique master en cours avec diplôme master
- **WHEN** `current_level = "master"` et `academic_level = "master"`
- **THEN** le score académique vaut (80 + 80) / 2 = 80

#### Scenario: Score académique avec valeur inconnue
- **WHEN** une réponse ne correspond à aucune clé dans la table de correspondance
- **THEN** la valeur manquante est remplacée par 0 sans lever d'exception

### Requirement: Calcul du score financier
Le moteur SHALL calculer un score financier sur 100 via la formule `budget_score × 0.7 + invest_readiness_score × 0.3`, où chaque valeur est mappée depuis `rules.ts`.

#### Scenario: Score financier budget zéro et investissement incertain
- **WHEN** `budget = "zero"` et `invest_readiness = "non_certain"`
- **THEN** le score financier vaut 20 × 0.7 + 10 × 0.3 = 17

#### Scenario: Score financier budget confortable et investissement certain
- **WHEN** `budget = "confortable"` et `invest_readiness = "oui_certain"`
- **THEN** le score financier vaut 100 × 0.7 + 100 × 0.3 = 100

### Requirement: Calcul du score de maturité
Le moteur SHALL calculer un score de maturité sur 100 à partir de la moyenne de `dossier_maturity`, `timeline` et `main_blocker`, chacun mappé via `rules.ts`.

#### Scenario: Score de maturité dossier prêt, urgence et confiance
- **WHEN** `dossier_maturity = "pret"`, `timeline = "urgent"`, `main_blocker = "confiance"`
- **THEN** le score de maturité vaut (100 + 90 + 70) / 3 ≈ 87

#### Scenario: Score de maturité dossier débutant
- **WHEN** `dossier_maturity = "debut"`, `timeline = "long"`, `main_blocker = "information"`
- **THEN** le score de maturité vaut (10 + 30 + 30) / 3 ≈ 23

### Requirement: Calcul du score global et attribution du segment
Le moteur SHALL calculer un score global via `academic × 0.4 + financial × 0.3 + maturity × 0.3` et attribuer un segment : `Explorer` si score < 40, `Candidat` si 40 ≤ score < 70, `Finaliste` si score ≥ 70.

#### Scenario: Segment Explorer
- **WHEN** le score global calculé vaut 32
- **THEN** le segment retourné est `"Explorer"`

#### Scenario: Segment Candidat
- **WHEN** le score global calculé vaut 55
- **THEN** le segment retourné est `"Candidat"`

#### Scenario: Segment Finaliste
- **WHEN** le score global calculé vaut 74
- **THEN** le segment retourné est `"Finaliste"`

#### Scenario: Frontière exacte 40
- **WHEN** le score global calculé vaut exactement 40
- **THEN** le segment retourné est `"Candidat"`

#### Scenario: Frontière exacte 70
- **WHEN** le score global calculé vaut exactement 70
- **THEN** le segment retourné est `"Finaliste"`

### Requirement: Déterminisme et pureté de la fonction
La fonction `computeScore` SHALL être pure : à partir des mêmes `TestAnswers`, elle retourne toujours le même `ScoringOutput`, sans effets de bord, sans appel réseau, sans accès DB.

#### Scenario: Idempotence du calcul
- **WHEN** `computeScore` est appelée deux fois avec les mêmes réponses
- **THEN** les deux résultats sont strictement identiques

### Requirement: Route API POST /api/scoring
La route SHALL accepter `{ answers: TestAnswers }`, appeler `computeScore` et retourner le `ScoringOutput` avec status 200. Elle ne MUST PAS persister en base (stub sans Prisma). Elle retourne 400 si `answers` est absent ou invalide.

#### Scenario: Appel valide
- **WHEN** `POST /api/scoring` reçoit `{ answers: { current_level: "lycee", ... } }` avec toutes les réponses
- **THEN** la réponse est 200 avec `{ academic_score, financial_score, maturity_score, segment }`

#### Scenario: Body absent
- **WHEN** `POST /api/scoring` reçoit un body vide
- **THEN** la réponse est 400 avec un message d'erreur
