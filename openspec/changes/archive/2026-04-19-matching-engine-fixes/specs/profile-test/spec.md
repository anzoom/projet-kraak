## MODIFIED Requirements

### Requirement: Réinitialisation systématique du formulaire
La page `/test` SHALL réinitialiser le store Zustand (`answers = {}`, `currentStep = 0`) et supprimer le cache `kraak_scoring_result` du localStorage à chaque montage du composant `TestStepper`.

#### Scenario: Visite après déconnexion
- **WHEN** un utilisateur se déconnecte puis accède à `/test`
- **THEN** le formulaire démarre à la question 1 sans aucune réponse pré-remplie

#### Scenario: Visite après un test précédent
- **WHEN** un utilisateur ayant déjà complété un test accède à `/test`
- **THEN** le formulaire repart à zéro, indépendamment des réponses précédentes

### Requirement: Invalidation du cache de scoring selon les réponses
`ResultsClient` SHALL comparer les réponses de session avec les réponses stockées dans `kraak_scoring_result` avant d'utiliser le cache. Si les réponses diffèrent, le cache est ignoré et un nouveau scoring est déclenché.

#### Scenario: Cache valide — réponses identiques
- **WHEN** `kraak_scoring_result.answers` correspond exactement aux réponses de `kraak_anonymous_session`
- **THEN** le score mis en cache est utilisé sans appel API

#### Scenario: Cache invalidé — réponses différentes
- **WHEN** les réponses de session diffèrent du cache
- **THEN** `/api/scoring` est appelé avec les nouvelles réponses et le cache est mis à jour

#### Scenario: Forçage re-scoring depuis email
- **WHEN** `needsScoring = true` (paramètre URL post-confirmation email)
- **THEN** le cache est ignoré et le scoring est recalculé depuis les réponses de session
