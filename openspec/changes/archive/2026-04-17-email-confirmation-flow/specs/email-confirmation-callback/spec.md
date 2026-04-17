## ADDED Requirements

### Requirement: Callback de confirmation email Supabase
La route `/auth/callback` SHALL échanger le paramètre `code` contre une session Supabase (PKCE), puis rediriger vers l'URL indiquée par le paramètre `next` (par défaut `/results`). Si le paramètre `from=test` est présent, la redirection inclut `?needs_scoring=true` pour signaler à la page cible que le scoring doit être déclenché.

#### Scenario: Confirmation réussie depuis le parcours test
- **WHEN** l'utilisateur clique sur le lien de confirmation reçu par email après inscription depuis `/test`
- **THEN** le code est échangé contre une session, et l'utilisateur est redirigé vers `/results?needs_scoring=true`

#### Scenario: Confirmation réussie sans contexte test
- **WHEN** l'utilisateur clique sur le lien de confirmation sans paramètre `from=test`
- **THEN** le code est échangé contre une session, et l'utilisateur est redirigé vers `/results`

#### Scenario: Lien de confirmation invalide ou expiré
- **WHEN** le code est absent ou l'échange échoue (lien expiré, déjà utilisé)
- **THEN** l'utilisateur est redirigé vers `/auth/confirm-error`

### Requirement: Page d'erreur de confirmation
La page `/auth/confirm-error` SHALL informer l'utilisateur que le lien de confirmation est invalide ou expiré, et proposer de renvoyer un nouveau lien via `supabase.auth.resend()`.

#### Scenario: Affichage de la page d'erreur
- **WHEN** l'utilisateur est redirigé vers `/auth/confirm-error`
- **THEN** la page affiche un message explicatif et un champ email avec un bouton "Renvoyer le lien"

#### Scenario: Renvoi du lien de confirmation
- **WHEN** l'utilisateur saisit son email et soumet le formulaire de renvoi
- **THEN** `supabase.auth.resend({ type: "signup", email })` est appelé et un message de confirmation s'affiche

### Requirement: Déclenchement du scoring après confirmation
La page `/results` SHALL détecter le paramètre `?needs_scoring=true`, appeler `POST /api/scoring` avec les réponses depuis localStorage (`kraak_anonymous_session`), stocker le résultat dans `kraak_scoring_result`, puis nettoyer l'URL avec `router.replace("/results")`.

#### Scenario: Scoring déclenché après confirmation email
- **WHEN** l'utilisateur arrive sur `/results?needs_scoring=true` avec des réponses dans localStorage
- **THEN** le scoring est déclenché, le résultat stocké, et l'URL est nettoyée sans rechargement de page

#### Scenario: Absence de réponses dans localStorage après confirmation
- **WHEN** l'utilisateur arrive sur `/results?needs_scoring=true` mais `kraak_anonymous_session` est absent ou vide
- **THEN** le param est nettoyé et la page affiche un CTA "Refaire le test" sans erreur bloquante
