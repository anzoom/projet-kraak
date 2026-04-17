## Why

Actuellement, après l'inscription, l'utilisateur est redirigé vers une page "Vérifie ta boîte mail" mais le lien de confirmation Supabase le renvoie vers une URL non gérée, bloquant l'accès à ses résultats. Ce flux doit être complété avant toute monétisation pour que les utilisateurs inscrits puissent accéder à `/results`.

## What Changes

- Création d'une route `/auth/callback` qui traite le code d'autorisation Supabase (PKCE) et établit la session
- Redirection automatique vers `/results` après confirmation réussie (ou vers la page `next` enregistrée avant inscription)
- Page d'erreur dédiée si le lien est expiré ou invalide (`/auth/confirm-error`)
- Mise à jour de la page "Vérifie ta boîte mail" pour indiquer la durée de validité du lien et proposer le renvoi

## Capabilities

### New Capabilities
- `email-confirmation-callback`: Gestion du callback OAuth Supabase PKCE, échange du code contre une session, et redirection post-confirmation

### Modified Capabilities
- `user-registration`: Ajouter le comportement post-inscription (stockage de `next` en cookie, affichage de la durée de validité du lien)

## Impact

- Nouvelle route : `src/app/(app)/auth/callback/route.ts` (Route Handler)
- Nouvelle page erreur : `src/app/(app)/auth/confirm-error/page.tsx`
- Modification : `src/app/(app)/auth/verify/page.tsx` (page "Vérifie ta boîte mail" existante)
- Modification : `src/app/(app)/auth/register/page.tsx` (stockage du `next` avant redirection)
- Dépendance : `@supabase/ssr` déjà installé, pas de nouvelle dépendance
