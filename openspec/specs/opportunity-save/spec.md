### Requirement: Sauvegarde locale des opportunités favorites
Le système SHALL permettre à l'utilisateur de sauvegarder et désauvegarder des opportunités via un bouton cœur affiché sur chaque `RecommendationCard`. La persistance est exclusivement en `localStorage` — aucune synchronisation serveur, aucune authentification requise.

#### Scenario: Sauvegarder une opportunité
- **WHEN** l'utilisateur clique sur le bouton cœur d'une opportunité non sauvegardée
- **THEN** l'opportunité est ajoutée à `savedIds` dans le store Zustand, l'icône passe à l'état "plein", et l'état est persisté dans `localStorage` sous la clé `kraak_saved_opportunities`

#### Scenario: Désauvegarder une opportunité
- **WHEN** l'utilisateur clique sur le bouton cœur d'une opportunité déjà sauvegardée
- **THEN** l'opportunité est retirée de `savedIds`, l'icône repasse à l'état "contour"

#### Scenario: Persistance après rechargement
- **WHEN** l'utilisateur recharge la page
- **THEN** les opportunités précédemment sauvegardées sont restaurées depuis `localStorage` et les boutons cœur reflètent l'état sauvegardé

#### Scenario: Compteur de favoris
- **WHEN** le composant `ResultsHeaderMenu` est affiché
- **THEN** le compteur de favoris affiche le nombre d'opportunités actuellement sauvegardées (`savedIds.length`)

### Requirement: Hook useSavedOpportunities
Le hook `useSavedOpportunities` SHALL exposer `savedIds`, `toggle(id)`, `isSaved(id)` et `count`. Il est implémenté via Zustand avec le middleware `persist` et `createJSONStorage(() => localStorage)`.

#### Scenario: toggle() ajoute un ID absent
- **WHEN** `toggle("opp-123")` est appelé et "opp-123" n'est pas dans `savedIds`
- **THEN** "opp-123" est ajouté à `savedIds`

#### Scenario: toggle() retire un ID présent
- **WHEN** `toggle("opp-123")` est appelé et "opp-123" est déjà dans `savedIds`
- **THEN** "opp-123" est retiré de `savedIds`

#### Scenario: isSaved() retourne l'état correct
- **WHEN** `isSaved("opp-123")` est appelé
- **THEN** retourne `true` si "opp-123" est dans `savedIds`, `false` sinon

### Requirement: SaveButton affiché sur chaque carte de recommandation
Le composant `SaveButton` SHALL être un Client Component affichant une icône cœur. Il appelle `useSavedOpportunities` pour lire et modifier l'état.

#### Scenario: Icône cœur reflète l'état sauvegardé
- **WHEN** le SaveButton est affiché pour une opportunité sauvegardée
- **THEN** l'icône cœur est dans l'état "plein" (rempli)

#### Scenario: Icône cœur reflète l'état non sauvegardé
- **WHEN** le SaveButton est affiché pour une opportunité non sauvegardée
- **THEN** l'icône cœur est dans l'état "contour" (vide)
