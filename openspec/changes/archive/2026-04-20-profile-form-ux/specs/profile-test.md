### Requirement: Questionnaire 10 questions
La page `/test` SHALL afficher un questionnaire de 10 questions à choix unique, une question par écran, dans un ordre fixe et linéaire.

#### Scenario: Affichage de la première question
- **WHEN** l'utilisateur navigue vers `/test` sans session existante
- **THEN** la première question est affichée avec ses options de réponse et la barre de progression à l'étape 1/10

#### Scenario: Sélection d'une réponse
- **WHEN** l'utilisateur sélectionne une option de réponse
- **THEN** l'option est visuellement sélectionnée et le bouton "Suivant" devient actif

### Requirement: Première question — pays d'origine
La première question du questionnaire SHALL demander le pays d'origine de l'utilisateur, avec une liste déroulante (dropdown) contenant les 9 pays compatibles CinetPay et l'option "Autre pays africain".

#### Scenario: Options pays d'origine affichées
- **WHEN** l'utilisateur est à la question 1
- **THEN** un menu déroulant affiche : Bénin, Burkina Faso, Cameroun, Côte d'Ivoire, Guinée, Mali, RD Congo, Sénégal, Togo, Autre pays africain

#### Scenario: Réponse origin_country sélectionnée
- **WHEN** l'utilisateur sélectionne une option dans le dropdown pays d'origine
- **THEN** la valeur est enregistrée sous la clé `origin_country` dans le store

### Requirement: Toutes les questions en format dropdown
Toutes les questions du questionnaire SHALL être rendues sous forme de menu déroulant (SelectCard ou CountrySelectCard), sans boutons radio.

#### Scenario: Questions 1–9 affichées en dropdown
- **WHEN** l'utilisateur répond aux questions 1 à 9
- **THEN** chaque question présente un menu déroulant (composant SelectCard) permettant de choisir parmi les options listées

#### Scenario: Question pays de destination en dropdown dynamique
- **WHEN** l'utilisateur atteint la question "pays de destination"
- **THEN** un dropdown dynamique (CountrySelectCard) charge les pays depuis `/api/countries`

### Requirement: Question invest_readiness supprimée
Le questionnaire SHALL contenir 10 questions sans la question `invest_readiness`. Cette question ne doit plus apparaître dans le formulaire.

#### Scenario: Formulaire sans invest_readiness
- **WHEN** l'utilisateur parcourt les 10 questions
- **THEN** aucune question sur la disposition à investir n'est affichée

### Requirement: Complétion et redirection selon session
À la validation de la 10ème réponse, le système SHALL rediriger l'utilisateur vers `/results` s'il a une session active, sinon vers `/auth/register?from=test`.

#### Scenario: Test complété sans session
- **WHEN** l'utilisateur répond à la question 10 et clique sur "Voir mes résultats" sans session Supabase active
- **THEN** il est redirigé vers `/auth/register?from=test`

#### Scenario: Test complété avec session active
- **WHEN** l'utilisateur répond à la question 10 et clique sur "Voir mes résultats" avec une session Supabase active
- **THEN** il est redirigé directement vers `/results`
