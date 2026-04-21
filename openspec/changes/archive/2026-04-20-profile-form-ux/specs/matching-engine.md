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
