### Requirement: Formulaire de connexion email/password
La page `/auth/login` SHALL afficher un formulaire avec les champs email et mot de passe. La soumission appelle Supabase `signInWithPassword`. Le bouton est désactivé pendant le chargement.

#### Scenario: Affichage de la page login
- **WHEN** l'utilisateur navigue vers `/auth/login`
- **THEN** la page affiche un formulaire avec les champs email, mot de passe, un lien "Mot de passe oublié ?" et un bouton "Se connecter"

#### Scenario: Connexion réussie
- **WHEN** l'utilisateur soumet des identifiants valides
- **THEN** Supabase authentifie l'utilisateur, le JWT est stocké en cookie HttpOnly, et l'utilisateur est redirigé

#### Scenario: Identifiants invalides
- **WHEN** l'utilisateur soumet un email ou mot de passe incorrect
- **THEN** un message d'erreur "Email ou mot de passe incorrect" s'affiche sans rechargement de page

#### Scenario: Champs vides
- **WHEN** l'utilisateur soumet le formulaire avec un champ vide
- **THEN** la validation HTML5 native empêche la soumission

### Requirement: Redirection contextuelle après connexion
Après une connexion réussie, le système SHALL rediriger l'utilisateur vers l'URL spécifiée dans `?next` si présente et valide (chemin relatif uniquement), sinon vers `/results`.

#### Scenario: Redirection vers next
- **WHEN** la connexion réussit et l'URL contient `?next=/results`
- **THEN** l'utilisateur est redirigé vers `/results`

#### Scenario: Redirection par défaut
- **WHEN** la connexion réussit et aucun paramètre `?next` n'est présent
- **THEN** l'utilisateur est redirigé vers `/results`

#### Scenario: Paramètre next rejeté si URL absolue
- **WHEN** `?next` contient une URL absolue (ex. `https://example.com`)
- **THEN** l'utilisateur est redirigé vers `/results` (protection open redirect)

### Requirement: Workflow login-first post-test
Après la complétion du test de profil, l'utilisateur SHALL être redirigé vers `/auth/login?from=test`. Le formulaire SHALL adapter son sous-titre et son lien "Créer un compte" selon ce contexte.

#### Scenario: Sous-titre contextuel post-test
- **WHEN** `LoginForm` est affiché avec `?from=test`
- **THEN** le sous-titre est "Tu as terminé le test ! Connecte-toi pour accéder à tes résultats."

#### Scenario: Lien Créer un compte avec contexte test propagé
- **WHEN** `?from=test` est présent et l'utilisateur clique "Créer un compte"
- **THEN** la navigation va vers `/auth/register?from=test`

### Requirement: Lien mot de passe oublié
La page `/auth/login` SHALL afficher un lien "Mot de passe oublié ?" sous le champ mot de passe, pointant vers `/auth/forgot-password`.

#### Scenario: Lien affiché et navigable
- **WHEN** l'utilisateur accède à `/auth/login`
- **THEN** le lien "Mot de passe oublié ?" est visible et pointe vers `/auth/forgot-password`

### Requirement: Page de demande de réinitialisation mot de passe
La page `/auth/forgot-password` SHALL permettre à l'utilisateur de soumettre son email pour recevoir un lien de réinitialisation via `supabase.auth.resetPasswordForEmail`.

#### Scenario: Email soumis avec succès
- **WHEN** l'utilisateur soumet un email valide
- **THEN** un email de réinitialisation est envoyé et l'écran de confirmation affiche l'adresse

#### Scenario: Erreur Supabase
- **WHEN** l'appel `resetPasswordForEmail` échoue
- **THEN** un message d'erreur est affiché, le formulaire reste accessible

### Requirement: Page de saisie du nouveau mot de passe
La page `/auth/update-password` SHALL permettre à l'utilisateur (session active après échange du code PKCE) de définir un nouveau mot de passe via `supabase.auth.updateUser`.

#### Scenario: Mots de passe non identiques
- **WHEN** les deux champs mot de passe ne correspondent pas
- **THEN** une erreur est affichée sans appel API

#### Scenario: Mot de passe trop court
- **WHEN** le mot de passe est inférieur à 8 caractères
- **THEN** une erreur est affichée sans appel API

#### Scenario: Mise à jour réussie
- **WHEN** `supabase.auth.updateUser({ password })` réussit
- **THEN** l'utilisateur est redirigé vers `/results`

#### Scenario: Lien expiré
- **WHEN** `supabase.auth.updateUser` retourne une erreur
- **THEN** un message explicite sur l'expiration possible du lien est affiché

### Requirement: Déconnexion
La route `GET /auth/logout` SHALL appeler Supabase `signOut`, supprimer le cookie de session, et rediriger vers `/`.

#### Scenario: Déconnexion réussie
- **WHEN** l'utilisateur navigue vers `/auth/logout`
- **THEN** la session est terminée, le cookie JWT est supprimé et l'utilisateur est redirigé vers `/`
