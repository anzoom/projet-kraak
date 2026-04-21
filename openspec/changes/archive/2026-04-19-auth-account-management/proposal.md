## Why

Trois lacunes dans la gestion des comptes utilisateur dégradaient l'expérience et bloquaient des scénarios courants :

1. **Aucune réinitialisation de mot de passe** : un utilisateur ayant oublié son mot de passe n'avait aucun moyen de le récupérer — le formulaire de connexion ne proposait pas de lien "Mot de passe oublié ?".
2. **Workflow inscription forcée** : après le test de profil, l'utilisateur était redirigé directement vers l'inscription (`/auth/register`). Les utilisateurs déjà inscrits devaient naviguer manuellement vers la connexion, créant une friction inutile.
3. **Propagation du contexte `from=test` incomplète** : en passant par la connexion d'abord, il fallait s'assurer que le contexte test était transmis au formulaire d'inscription pour que la redirection post-confirmation email reste correcte.

## What Changes

- **Lien "Mot de passe oublié ?"** ajouté dans `LoginForm`, positionné sous le champ mot de passe.
- **Page `/auth/forgot-password`** créée avec `ForgotPasswordForm` : saisie d'email → `supabase.auth.resetPasswordForEmail()` → écran de confirmation avec l'adresse affichée.
- **Page `/auth/update-password`** créée avec `UpdatePasswordForm` : saisie + confirmation du nouveau mot de passe → validation client (correspondance, 8 caractères min) → `supabase.auth.updateUser({ password })` → redirection `/results`.
- **Workflow login-first** : `TestStepper` redirige vers `/auth/login?from=test` au lieu de `/auth/register?from=test`.
- **Sous-titre contextuel** dans `LoginForm` : message différent selon `from=test` ("Tu as terminé le test !").
- **Propagation `from=test`** : le lien "Créer un compte" dans `LoginForm` inclut `?from=test` quand le contexte test est actif.

## Capabilities

### New Capabilities
- `user-login` : lien mot de passe oublié, workflow login-first post-test, sous-titre contextuel
- `password-reset` : flux complet de réinitialisation (demande → email → nouveau mot de passe)

### Modified Capabilities
- `user-registration` : accessible depuis la connexion en second recours (lien "Créer un compte"), contexte `from=test` propagé

## Impact

- `src/components/features/auth/LoginForm.tsx` : ajout `fromTest`, sous-titre contextuel, lien "Mot de passe oublié ?", lien "Créer un compte" conditionnel
- `src/components/features/test/TestStepper.tsx` : redirection `/auth/login?from=test` au lieu de `/auth/register?from=test`
- `src/components/features/auth/ForgotPasswordForm.tsx` : nouveau composant client
- `src/components/features/auth/UpdatePasswordForm.tsx` : nouveau composant client
- `src/app/(app)/(public)/auth/forgot-password/page.tsx` : nouvelle page
- `src/app/(app)/(public)/auth/update-password/page.tsx` : nouvelle page
- La route `/auth/callback` existante gère déjà l'échange de code PKCE pour les deux cas (signup + password reset) — aucune modification nécessaire
