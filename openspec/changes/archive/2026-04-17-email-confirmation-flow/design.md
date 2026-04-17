## Context

La route `/auth/callback/route.ts` existe déjà et gère correctement l'échange PKCE code → session. Le problème principal est que `triggerScoring()` dans `RegisterForm.tsx` n'est appelé que lorsque la session est immédiate (`data.session != null`). Quand la confirmation email est activée, aucun scoring n'est déclenché après confirmation, donc l'utilisateur arrive sur `/results` avec une session valide mais aucune donnée de résultats.

État actuel :
- Callback route : `/auth/callback/route.ts` ✓ (fonctionnel)
- Pas de page d'erreur dédiée pour lien expiré/invalide
- `RegisterForm.tsx` ne passe pas `emailRedirectTo` → Supabase utilise l'URL de redirect par défaut, sans paramètres `next` ou `from`
- Le scoring est stocké dans localStorage, inaccessible depuis le Route Handler server-side

## Goals / Non-Goals

**Goals:**
- Déclencher le scoring après confirmation email, en utilisant les réponses stockées dans localStorage
- Gérer les erreurs de confirmation (lien expiré, déjà utilisé) avec une page dédiée
- Permettre le renvoi du lien de confirmation
- Passer `emailRedirectTo` dynamique pour conserver le contexte `from=test` et `next=/results`

**Non-Goals:**
- Modifier le template email Supabase (hors périmètre MVP)
- Gérer la confirmation sur un navigateur différent de celui d'inscription (edge case non prioritaire)
- Implémenter un système de retry côté serveur pour le scoring

## Decisions

### D1 — Passer `emailRedirectTo` dynamique avec contexte
**Décision :** Ajouter `options.emailRedirectTo` dans l'appel `supabase.auth.signUp()` :
```ts
emailRedirectTo: `${window.location.origin}/auth/callback?next=/results&from=test`
```
**Rationale :** Permet au callback de connaître le contexte d'origine sans état serveur. Alternative rejetée : cookie serveur `needs_scoring=true` — plus complexe, nécessite un middleware.

### D2 — Déclencher le scoring côté client depuis `/results`
**Décision :** Après redirection depuis le callback, `/results` détecte le param `?needs_scoring=true` (ajouté par le callback quand `from=test`) et appelle `/api/scoring` en client-side avec les réponses en localStorage.
**Rationale :** Le Route Handler n'a pas accès au localStorage. La page `/results` a déjà la logique client. Alternative rejetée : stocker les réponses dans Supabase user metadata lors du `signUp` — ajoute une dépendance sur le timing de création de l'utilisateur.

### D3 — Page d'erreur `/auth/confirm-error` avec action de renvoi
**Décision :** Rediriger vers `/auth/confirm-error?email=xxx` en cas d'erreur dans le callback (au lieu de `/auth/login?error=confirmation_failed`). Cette page propose de renvoyer le lien via un appel à `supabase.auth.resend()`.
**Rationale :** Meilleure UX — l'utilisateur comprend ce qui s'est passé et peut agir.

## Risks / Trade-offs

- **localStorage perdu si autre navigateur** → L'utilisateur arrive sur `/results` sans données de scoring. Mitigation : afficher un CTA "Refaire le test" au lieu d'un écran vide.
- **`emailRedirectTo` non autorisé dans Supabase** → Supabase Dashboard > Authentication > URL Configuration doit lister `http://localhost:3000/auth/callback` comme URL autorisée. Déjà configuré par défaut en dev.
- **Double scoring** → Si l'utilisateur recharge `/results?needs_scoring=true`, le scoring est déclenché plusieurs fois. Mitigation : supprimer le param `needs_scoring` de l'URL avec `router.replace` après le premier appel.

## Migration Plan

1. Modifier `RegisterForm.tsx` : ajouter `emailRedirectTo` dans `signUp`
2. Modifier `/auth/callback/route.ts` : détecter `from=test`, ajouter `needs_scoring=true` dans la redirect vers `/results`
3. Modifier `/results` : détecter `needs_scoring=true`, déclencher scoring, nettoyer l'URL
4. Créer `/auth/confirm-error/page.tsx` : page client avec resend
5. Mettre à jour l'état "confirmationPending" dans `RegisterForm` : ajouter durée de validité et bouton de renvoi
6. Pas de rollback nécessaire — tous les changements sont additifs
