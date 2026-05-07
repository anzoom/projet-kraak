### Requirement: Formulaire d'inscription email/password
La page `/auth/register` SHALL afficher un formulaire avec les champs email et mot de passe. La soumission appelle Supabase `signUp`. Le bouton de soumission est désactivé pendant le chargement.

#### Scenario: Affichage de la page register
- **WHEN** l'utilisateur navigue vers `/auth/register`
- **THEN** la page affiche un formulaire avec les champs email, mot de passe et un bouton "S'inscrire"

#### Scenario: Inscription réussie
- **WHEN** l'utilisateur soumet un email valide et un mot de passe ≥ 6 caractères
- **THEN** Supabase crée le compte, le JWT est stocké en cookie HttpOnly, et l'utilisateur est redirigé

#### Scenario: Email déjà utilisé
- **WHEN** l'utilisateur soumet un email déjà enregistré
- **THEN** un message d'erreur s'affiche sous le formulaire sans rechargement de page

#### Scenario: Mot de passe trop court
- **WHEN** l'utilisateur soumet un mot de passe de moins de 6 caractères
- **THEN** un message d'erreur indique que le mot de passe doit faire au moins 6 caractères

#### Scenario: Champs vides
- **WHEN** l'utilisateur soumet le formulaire avec un champ vide
- **THEN** la validation HTML5 native empêche la soumission

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

### Requirement: État confirmation en attente amélioré
L'état "Vérifie ta boîte mail" dans `RegisterForm` SHALL indiquer la durée de validité du lien (24h) et proposer un bouton "Renvoyer le lien" via `supabase.auth.resend({ type: "signup", email })`.

#### Scenario: Affichage de la durée de validité
- **WHEN** l'état confirmationPending est affiché
- **THEN** le message mentionne que le lien est valable 24 heures

#### Scenario: Renvoi du lien depuis l'état confirmationPending
- **WHEN** l'utilisateur clique sur "Renvoyer le lien"
- **THEN** `supabase.auth.resend({ type: "signup", email })` est appelé et un message "Lien renvoyé" s'affiche temporairement

### Requirement: Lien vers la page de connexion
La page `/auth/register` SHALL afficher un lien vers `/auth/login` pour les utilisateurs ayant déjà un compte.

#### Scenario: Lien de connexion visible
- **WHEN** la page `/auth/register` est affichée
- **THEN** un lien "J'ai déjà un compte" ou similaire est visible et navigue vers `/auth/login`
