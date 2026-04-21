## MODIFIED Requirements

### Requirement: Lien mot de passe oublié
Le formulaire de connexion SHALL afficher un lien "Mot de passe oublié ?" visible sous le champ mot de passe, pointant vers `/auth/forgot-password`.

#### Scenario: Lien affiché sur la page connexion
- **WHEN** l'utilisateur accède à `/auth/login`
- **THEN** le lien "Mot de passe oublié ?" est visible sous le champ mot de passe

### Requirement: Workflow login-first post-test
Après la complétion du test de profil, l'utilisateur SHALL être redirigé vers `/auth/login?from=test`. Le formulaire de connexion SHALL afficher un sous-titre contextuel et un lien "Créer un compte" incluant le paramètre `?from=test`.

#### Scenario: Sous-titre contextuel post-test
- **WHEN** `LoginForm` est affiché avec `?from=test`
- **THEN** le sous-titre est "Tu as terminé le test ! Connecte-toi pour accéder à tes résultats."

#### Scenario: Sous-titre standard hors test
- **WHEN** `LoginForm` est affiché sans `?from=test`
- **THEN** le sous-titre est "Accède à tes résultats et recommandations"

#### Scenario: Lien Créer un compte avec contexte test
- **WHEN** `LoginForm` est affiché avec `?from=test` et l'utilisateur clique "Créer un compte"
- **THEN** la navigation va vers `/auth/register?from=test`

### Requirement: Page de demande de réinitialisation mot de passe
La page `/auth/forgot-password` SHALL permettre à l'utilisateur de saisir son email et de recevoir un lien de réinitialisation via `supabase.auth.resetPasswordForEmail`.

#### Scenario: Email soumis avec succès
- **WHEN** l'utilisateur soumet un email valide
- **THEN** Supabase envoie un email de réinitialisation et l'écran de confirmation est affiché avec l'adresse email

#### Scenario: Erreur Supabase
- **WHEN** l'appel `resetPasswordForEmail` échoue
- **THEN** un message d'erreur est affiché, le formulaire reste accessible

### Requirement: Page de saisie du nouveau mot de passe
La page `/auth/update-password` SHALL permettre à l'utilisateur (disposant d'une session active après échange du code) de définir un nouveau mot de passe via `supabase.auth.updateUser`.

#### Scenario: Mots de passe non identiques
- **WHEN** les deux champs mot de passe ne correspondent pas
- **THEN** une erreur "Les mots de passe ne correspondent pas." est affichée sans appel API

#### Scenario: Mot de passe trop court
- **WHEN** le mot de passe est inférieur à 8 caractères
- **THEN** une erreur "Au moins 8 caractères" est affichée sans appel API

#### Scenario: Mise à jour réussie
- **WHEN** `supabase.auth.updateUser({ password })` réussit
- **THEN** l'utilisateur est redirigé vers `/results`

#### Scenario: Lien expiré ou session invalide
- **WHEN** `supabase.auth.updateUser` retourne une erreur
- **THEN** un message explicite indiquant l'expiration possible du lien est affiché
