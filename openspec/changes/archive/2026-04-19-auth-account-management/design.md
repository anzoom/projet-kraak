## Architecture

### Flux réinitialisation mot de passe

```
/auth/login → clic "Mot de passe oublié ?"
  → /auth/forgot-password
  → supabase.auth.resetPasswordForEmail(email, { redirectTo: /auth/callback?next=/auth/update-password })
  → Email envoyé → écran de confirmation
  → Utilisateur clique le lien email
  → /auth/callback?code=xxx&next=/auth/update-password
  → exchangeCodeForSession(code) → session créée
  → Redirect /auth/update-password
  → supabase.auth.updateUser({ password })
  → Redirect /results
```

Le flux utilise le PKCE natif de `@supabase/ssr`. La route `/auth/callback` existante gère les deux types (signup confirmation et password reset) via `exchangeCodeForSession` — aucune distinction de type nécessaire.

### Workflow login-first post-test

```
Test complété (question 10)
  → /auth/login?from=test
    ├── Utilisateur existant → connexion → /results
    └── Nouvel utilisateur → clic "Créer un compte" → /auth/register?from=test
          → inscription → email de confirmation
          → /auth/callback?next=/results&from=test → /results?needs_scoring=true
```

Le param `from=test` est lu par `LoginForm` via `useSearchParams()` pour :
1. Afficher le sous-titre contextuel
2. Propager `?from=test` au lien "Créer un compte"

### Validation UpdatePasswordForm

Validation côté client uniquement (Supabase valide aussi côté serveur) :
- Mots de passe doivent correspondre
- Longueur minimum 8 caractères
- En cas d'erreur Supabase : message explicite sur l'expiration possible du lien
