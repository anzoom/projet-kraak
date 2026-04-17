## MODIFIED Requirements

### Requirement: Flux post-inscription avec scoring
Après une inscription réussie depuis `/auth/register?from=test`, le système SHALL :
- Si la session est **immédiate** (confirmation désactivée) : lire les réponses depuis localStorage, appeler `POST /api/scoring`, stocker le résultat sous `kraak_scoring_result`, puis rediriger vers `/results`
- Si la session est **différée** (confirmation email activée) : appeler `signUp` avec `options.emailRedirectTo` incluant `?next=/results&from=test`, puis afficher l'état de confirmation en attente

#### Scenario: Inscription depuis le test — session immédiate
- **WHEN** l'inscription réussit avec session immédiate et l'URL contient `?from=test` et des réponses existent dans `kraak_anonymous_session`
- **THEN** le score est calculé via `/api/scoring`, stocké sous `kraak_scoring_result` et l'utilisateur est redirigé vers `/results`

#### Scenario: Inscription depuis le test — confirmation email requise
- **WHEN** l'inscription réussit sans session immédiate et l'URL contient `?from=test`
- **THEN** `emailRedirectTo` est passé avec `?next=/results&from=test` et l'état "Vérifie ta boîte mail" s'affiche

#### Scenario: Inscription sans réponses de test
- **WHEN** l'inscription réussit mais `kraak_anonymous_session` est absent ou vide dans localStorage
- **THEN** l'utilisateur est redirigé vers `/results` sans appel à `/api/scoring`

#### Scenario: Inscription sans paramètre from=test
- **WHEN** l'inscription réussit et l'URL ne contient pas `?from=test`
- **THEN** l'utilisateur est redirigé vers `/`

## ADDED Requirements

### Requirement: État confirmation en attente amélioré
L'état "Vérifie ta boîte mail" dans `RegisterForm` SHALL indiquer la durée de validité du lien (24h) et proposer un bouton "Renvoyer le lien" via `supabase.auth.resend({ type: "signup", email })`.

#### Scenario: Affichage de la durée de validité
- **WHEN** l'état confirmationPending est affiché
- **THEN** le message mentionne que le lien est valable 24 heures

#### Scenario: Renvoi du lien depuis l'état confirmationPending
- **WHEN** l'utilisateur clique sur "Renvoyer le lien"
- **THEN** `supabase.auth.resend({ type: "signup", email })` est appelé et un message "Lien renvoyé" s'affiche temporairement
