## MODIFIED Requirements

### Requirement: Inscription accessible depuis la connexion uniquement post-test
Après le test de profil, l'utilisateur SHALL voir la page de connexion en premier. La page d'inscription SHALL être accessible via le lien "Créer un compte" sur le formulaire de connexion, avec propagation du contexte `from=test`.

#### Scenario: Nouvel utilisateur post-test
- **WHEN** un utilisateur sans compte complète le test et clique "Créer un compte" depuis `/auth/login?from=test`
- **THEN** il est redirigé vers `/auth/register?from=test`

#### Scenario: Contexte test préservé dans le flux inscription
- **WHEN** l'utilisateur arrive sur `/auth/register?from=test` et s'inscrit
- **THEN** l'email de confirmation contient un lien redirect vers `/auth/callback?next=/results&from=test`
- **AND THEN** après confirmation, l'utilisateur est redirigé vers `/results?needs_scoring=true`
