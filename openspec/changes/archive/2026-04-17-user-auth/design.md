## Context

L'infrastructure Supabase Auth est déjà partiellement scaffoldée : les clients SSR (`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`) existent, `proxy.ts` contient déjà la vérification JWT complète et `/results` est déjà dans `PROTECTED_ROUTES`. Le `TestStepper` redirige vers `/auth/register?from=test` après la dernière question. Il reste à implémenter les pages d'UI et le flux post-inscription.

## Goals / Non-Goals

**Goals :**
- Pages `/auth/register` et `/auth/login` fonctionnelles avec formulaires email/password
- Flux post-inscription : lecture des réponses localStorage → appel `POST /api/scoring` → stockage du score → redirection `/results`
- Page `/results` stub : affiche le segment de l'utilisateur (depuis localStorage), protégée par JWT
- Route de déconnexion `GET /auth/logout`

**Non-Goals :**
- OAuth / connexion sociale (feature suivante si nécessaire)
- Persistance Prisma `UserProfileScore` (planifiée dans la feature résultats complète)
- Email de confirmation / double opt-in (désactivé sur le projet Supabase pour le MVP)
- Réinitialisation de mot de passe

## Decisions

### D1 — Formulaires auth en Client Components avec le browser client Supabase

Les formulaires `register` et `login` sont des Client Components utilisant `createSupabaseBrowserClient()` et les méthodes `signUp` / `signInWithPassword`. L'alternative (Server Actions avec `revalidatePath`) est plus complexe à câbler avec la gestion d'erreurs inline et la lecture du localStorage côté client après auth.

### D2 — Scoring post-inscription déclenché côté client

Après `signUp` réussi, le Client Component :
1. Lit `kraak_anonymous_session` dans localStorage pour récupérer les `answers`
2. Appelle `POST /api/scoring` avec les `answers`
3. Stocke `{ answers, score }` dans localStorage sous la clé `kraak_scoring_result`
4. Navigue vers `/results`

Justification : pas de persistance Prisma pour l'instant, garde l'auth découplée du scoring. Si l'utilisateur vide son localStorage avant d'aller sur `/results`, la page peut afficher un message "relance le test" — cas edge acceptable pour le MVP.

### D3 — proxy.ts n'a pas besoin d'être modifié

La vérification JWT pour `/results` est déjà implémentée (lignes 42–86). Le `proxy.ts` redirige vers `/auth/login?next=/results` si l'utilisateur n'est pas connecté — ce comportement est déjà correct.

### D4 — Page `/results` comme stub

La page affiche : le segment de l'utilisateur (lu depuis `kraak_scoring_result` dans localStorage), un titre de confirmation et un placeholder "Résultats complets bientôt disponibles". Elle est un Server Component avec un Client Component pour la lecture localStorage. L'implémentation complète (recommandations, paywall) est la feature suivante.

### D5 — Structure URL sous `(public)/auth/`

Les pages auth rejoignent le groupe `(public)` avec un layout minimal réutilisant le même header KRAAK que `/test`. La route de logout est un Route Handler à `src/app/auth/logout/route.ts` (hors du groupe `(public)` pour utiliser GET proprement).

### D6 — Redirection contextuelle via `?next`

- `proxy.ts` injecte déjà `?next=<pathname>` lors du redirect vers `/auth/login`
- La page login lit `searchParams.next` et redirige après connexion réussie
- La page register lit `?from=test` pour déclencher le scoring post-inscription

## Risks / Trade-offs

- **[Risque] Score perdu si localStorage effacé** → Mitigation : `/results` affiche un bouton "Relancer le test" si `kraak_scoring_result` est absent
- **[Risque] Supabase URL/KEY non configurés en local** → Mitigation : les clients crashent avec une erreur claire ; documenter dans `.env.example` (déjà présent)
- **[Trade-off] Pas de confirmation email** → Acceptable MVP ; à activer avant la mise en production

## Open Questions

- Faut-il créer une entrée `users` Prisma à la registration (pour lier les futures `UserProfileScore`) ? → Non pour cette feature, oui pour la feature résultats complète.
- Faut-il persister le score dans un cookie serveur plutôt que localStorage pour éviter la perte ? → Non pour le MVP ; localStorage suffit pour la démo.
