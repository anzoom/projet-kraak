## MODIFIED Requirements

### Requirement: Flux post-inscription avec scoring

Après une inscription réussie depuis `/auth/register?from=test`, le système SHALL :
- Si la session est **immédiate** (confirmation désactivée) : lire les réponses depuis localStorage, appeler `POST /api/scoring`, stocker le résultat sous `kraak_scoring_result`, appeler `POST /api/user/welcome` (fire-and-forget), puis rediriger vers `/results`
- Si la session est **différée** (confirmation email activée) : appeler `signUp` avec `options.emailRedirectTo` incluant `?next=/results&from=test`, puis afficher l'état de confirmation en attente

#### Scenario: Inscription depuis le test — session immédiate

- **WHEN** l'inscription réussit avec session immédiate et l'URL contient `?from=test` et des réponses existent dans `kraak_anonymous_session`
- **THEN** le score est calculé via `/api/scoring`, stocké sous `kraak_scoring_result`, `POST /api/user/welcome` est appelé, et l'utilisateur est redirigé vers `/results`

#### Scenario: Inscription depuis le test — confirmation email requise

- **WHEN** l'inscription réussit sans session immédiate et l'URL contient `?from=test`
- **THEN** `emailRedirectTo` est passé avec `?next=/results&from=test` et l'état "Vérifie ta boîte mail" s'affiche

#### Scenario: Inscription sans réponses de test

- **WHEN** l'inscription réussit mais `kraak_anonymous_session` est absent ou vide dans localStorage
- **THEN** l'utilisateur est redirigé vers `/results` sans appel à `/api/scoring`

#### Scenario: Inscription sans paramètre from=test — session immédiate

- **WHEN** l'inscription réussit avec session immédiate et l'URL ne contient pas `?from=test`
- **THEN** `POST /api/user/welcome` est appelé, et l'utilisateur est redirigé vers `/test?welcome=1`

#### Scenario: Inscription sans paramètre from=test — confirmation email requise

- **WHEN** l'inscription réussit sans session immédiate et l'URL ne contient pas `?from=test`
- **THEN** `emailRedirectTo` est passé avec `?next=/test&welcome=1` et l'état "Vérifie ta boîte mail" s'affiche
