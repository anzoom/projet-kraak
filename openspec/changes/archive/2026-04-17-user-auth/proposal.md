## Why

Le questionnaire de profil est fonctionnel et les moteurs de scoring/matching sont prêts, mais sans authentification les résultats ne peuvent pas être personnalisés, protégés par un paywall ni liés à un utilisateur identifié. L'auth Supabase est le prérequis à toutes les features suivantes (résultats, paiement, historique).

## What Changes

- Création de la page `/auth/register` : formulaire email + mot de passe, appel Supabase `signUp`, redirection vers `/results` après inscription réussie
- Création de la page `/auth/login` : formulaire email + mot de passe, appel Supabase `signInWithPassword`, redirection vers `/results` ou `/`
- Création de la page `/auth/logout` (route handler) : appel Supabase `signOut`, redirection vers `/`
- Intégration Supabase SSR (`@supabase/ssr`) : client serveur + client navigateur avec cookies HttpOnly
- Protection de la route `/results` dans `proxy.ts` : redirection vers `/auth/login` si non authentifié
- Stub de la page `/results` (placeholder) : affiche "Résultats disponibles" pour valider le flux complet — l'implémentation complète des résultats est une feature suivante
- Branchement du moteur de scoring post-inscription : après `signUp`, les réponses du localStorage sont envoyées à `POST /api/scoring` côté client, le résultat est stocké dans localStorage pour la page résultats

## Capabilities

### New Capabilities

- `user-registration`: Inscription email/password via Supabase Auth, avec validation du formulaire et gestion des erreurs (email déjà utilisé, mot de passe trop court)
- `user-login`: Connexion email/password via Supabase Auth, avec gestion des erreurs (identifiants invalides) et redirection contextuelle
- `auth-session`: Gestion de session côté serveur via Supabase SSR — lecture du JWT depuis les cookies HttpOnly, protection des routes dans `proxy.ts`, déconnexion

### Modified Capabilities

_(aucune — les specs existantes ne changent pas de comportement)_

## Impact

- `src/app/(public)/auth/register/page.tsx` — nouvelle page (Server Component + Client form)
- `src/app/(public)/auth/login/page.tsx` — nouvelle page (Server Component + Client form)
- `src/app/auth/logout/route.ts` — route handler de déconnexion
- `src/app/(public)/results/page.tsx` — stub de la page résultats (protégée)
- `src/lib/supabase/server.ts` — client Supabase SSR serveur
- `src/lib/supabase/client.ts` — client Supabase SSR navigateur
- `src/proxy.ts` — ajout de la protection de `/results`
- Dépendance : `@supabase/ssr` (déjà dans package.json)
- Variables d'environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (déjà dans `.env.example`)
