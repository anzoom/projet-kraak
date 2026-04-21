## Context

`/dashboard` est déjà dans `PROTECTED_ROUTES` dans `proxy.ts` — la protection middleware est en place. Le dossier `src/app/(app)/(protected)/dashboard/` existe mais est vide. Les réponses du test sont dans localStorage (`kraak_anonymous_session`) sous la forme `{ state: { answers: Record<string, string> } }` (format Zustand persist). Les questions et leurs labels sont disponibles dans `src/data/questions.ts`.

La `Navbar` est un Server Component qui vérifie la session Supabase. Elle affiche déjà un CTA conditionnel selon l'état de connexion.

## Goals / Non-Goals

**Goals :**
- Page `/dashboard` affichant : email de l'utilisateur, résumé des réponses du test (lisible), et 4 actions (résultats, refaire le test, changer le mot de passe, déconnexion)
- Déconnexion propre : `supabase.auth.signOut()` + redirect vers `/`
- `Navbar` : lien "Mon profil" à côté de "Mes résultats" pour les utilisateurs connectés
- Mobile-first, cohérent avec le design system KRAAK (rounded-full, primary, slate-dark)

**Non-Goals :**
- Formulaire d'édition des réponses (l'utilisateur refait le test)
- Modification de l'email ou du nom (hors scope MVP)
- Statistiques ou historique (Phase 2)

## Decisions

### D1 — Architecture page + client component
**Décision :** `dashboard/page.tsx` est un Server Component qui récupère l'utilisateur Supabase (`getUser()`) et passe l'email à un `ProfileClient.tsx` (client component). `ProfileClient` lit localStorage pour les réponses.
**Rationale :** La règle KRAAK impose que `user_id` soit extrait du JWT serveur. L'email vient du serveur ; les réponses au test viennent du localStorage client.

### D2 — Affichage des réponses du test
**Décision :** `ProfileClient` importe `questions` depuis `src/data/questions.ts` et mappe chaque `answers[question.id]` vers son label d'option correspondant. Les réponses sont affichées sous forme de liste "Question → Réponse".
**Rationale :** Permet à l'utilisateur de comprendre ce qui a généré ses recommandations sans jargon technique.

### D3 — Déconnexion côté client
**Décision :** Bouton "Se déconnecter" dans `ProfileClient` appelle `createSupabaseBrowserClient().auth.signOut()` puis `router.push("/")`.
**Rationale :** `signOut()` est une mutation côté client. La redirection vers `/` est préférable à `/auth/login` pour ne pas donner l'impression d'une erreur.

### D4 — Navbar : lien "Mon profil" secondaire
**Décision :** Dans `Navbar`, quand `session` est actif, afficher deux liens : "Mon profil" (lien texte) + "Mes résultats" (bouton primaire). "Mon profil" → `/dashboard`.
**Rationale :** Permet d'accéder au profil depuis n'importe quelle page sans chercher. Le CTA principal reste "Mes résultats" — l'action primaire de KRAAK.

### D5 — Message si pas de réponses en localStorage
**Décision :** Si `answers` est null ou vide, afficher : "Tu n'as pas encore complété le test de profil." avec un bouton "Faire le test →".
**Rationale :** L'utilisateur peut être connecté sans avoir fait le test (inscription → connexion direct sans test).

## Migration Plan

1. Créer `src/components/features/profile/ProfileClient.tsx`
2. Créer `src/app/(app)/(protected)/dashboard/page.tsx`
3. Modifier `src/components/features/landing/Navbar.tsx` — ajouter lien "Mon profil"
4. Vérifier TypeScript + tests
