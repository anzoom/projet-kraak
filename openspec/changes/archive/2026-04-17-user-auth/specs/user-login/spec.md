## ADDED Requirements

### Requirement: Formulaire de connexion email/password
La page `/auth/login` SHALL afficher un formulaire avec les champs email et mot de passe. La soumission appelle Supabase `signInWithPassword`. Le bouton est désactivé pendant le chargement.

#### Scenario: Affichage de la page login
- **WHEN** l'utilisateur navigue vers `/auth/login`
- **THEN** la page affiche un formulaire avec les champs email, mot de passe et un bouton "Se connecter"

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
Après une connexion réussie, le système SHALL rediriger l'utilisateur vers l'URL spécifiée dans `?next` si présente et valide (chemin relatif uniquement), sinon vers `/`.

#### Scenario: Redirection vers next
- **WHEN** la connexion réussit et l'URL contient `?next=/results`
- **THEN** l'utilisateur est redirigé vers `/results`

#### Scenario: Redirection par défaut
- **WHEN** la connexion réussit et aucun paramètre `?next` n'est présent
- **THEN** l'utilisateur est redirigé vers `/`

#### Scenario: Paramètre next rejeté si URL absolue
- **WHEN** `?next` contient une URL absolue (ex. `https://example.com`)
- **THEN** l'utilisateur est redirigé vers `/` (protection open redirect)

### Requirement: Lien vers la page d'inscription
La page `/auth/login` SHALL afficher un lien vers `/auth/register` pour les utilisateurs sans compte.

#### Scenario: Lien d'inscription visible
- **WHEN** la page `/auth/login` est affichée
- **THEN** un lien "Créer un compte" ou similaire est visible et navigue vers `/auth/register`

### Requirement: Déconnexion
La route `GET /auth/logout` SHALL appeler Supabase `signOut`, supprimer le cookie de session, et rediriger vers `/`.

#### Scenario: Déconnexion réussie
- **WHEN** l'utilisateur navigue vers `/auth/logout`
- **THEN** la session est terminée, le cookie JWT est supprimé et l'utilisateur est redirigé vers `/`
