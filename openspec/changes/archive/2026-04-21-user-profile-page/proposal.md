## Why

Un utilisateur connecté n'a aucun endroit pour voir son profil, revoir ses réponses au test ou se déconnecter proprement. Le route `/dashboard` est déjà protégée dans `proxy.ts` mais ne contient aucune page — elle retourne une 404.

Sans page profil, l'utilisateur :
- Ne peut pas se déconnecter sans passer par une URL cachée
- Ne peut pas vérifier les réponses qui ont produit ses recommandations
- Ne sait pas qui il est connecté en tant que

## What Changes

- Création de la page `/dashboard` : récapitulatif des réponses du test + actions rapides (résultats, refaire le test, changer de mot de passe, déconnexion)
- Lien "Mon profil" ajouté dans la `Navbar` de la landing (et/ou dans le header de la page résultats) pour les utilisateurs connectés
- La déconnexion appelle `supabase.auth.signOut()` côté client et redirige vers `/`

## Capabilities

### New Capabilities
- `user-profile` : page `/dashboard` affichant l'email Supabase, les réponses du test (depuis localStorage), et les actions utilisateur

### Modified Capabilities
- `landing-page` : `Navbar` affiche un lien "Mon profil" ou "Tableau de bord" si l'utilisateur est connecté

## Impact

- Nouveau fichier : `src/app/(app)/(protected)/dashboard/page.tsx`
- Nouveau composant : `src/components/features/profile/ProfileClient.tsx` (client component — lit localStorage)
- Modification : `src/components/features/landing/Navbar.tsx` — lien profil si session active
