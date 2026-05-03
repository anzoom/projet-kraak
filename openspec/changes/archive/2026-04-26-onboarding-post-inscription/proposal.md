## Why

Après inscription, les nouveaux utilisateurs n'ont ni email de bienvenue ni guidage clair vers le test de profil — ils atterrissent sur `/` ou `/results` sans contexte. Corriger ça améliore l'activation (taux d'utilisateurs qui complètent le test) et pose les bases d'une relation email avec l'utilisateur dès le premier jour.

## What Changes

- Envoyer un email de bienvenue branded (Resend) dès qu'un compte est confirmé, via un appel depuis `RegisterForm` (session immédiate) ou depuis le callback d'auth (session différée après confirmation email)
- Créer une API `POST /api/user/welcome` dédiée : récupère l'email de l'utilisateur authentifié et envoie l'email de bienvenue (idempotente via flag `welcome_sent` sur le modèle `User`)
- Ajouter le champ `welcome_sent Boolean @default(false)` sur le modèle `User` en Prisma
- Modifier la redirection post-inscription sans `?from=test` : rediriger vers `/test?welcome=1` au lieu de `/` pour guider les nouveaux utilisateurs vers le test de profil
- Afficher un bandeau de bienvenue sur `/test` si `?welcome=1` est présent dans l'URL

## Capabilities

### New Capabilities

- `user-onboarding` : email de bienvenue post-inscription via Resend + redirection guidée vers le test de profil pour les nouveaux utilisateurs

### Modified Capabilities

- `user-registration` : la redirection post-inscription sans `?from=test` passe de `/` à `/test?welcome=1`

## Impact

- `prisma/schema.prisma` : ajout champ `welcome_sent` sur `User`
- Nouvelle migration Prisma
- Nouveau fichier `src/app/api/user/welcome/route.ts`
- Modification `src/components/features/auth/RegisterForm.tsx` : appel `/api/user/welcome` après inscription réussie + redirection vers `/test?welcome=1`
- Modification `src/app/(app)/auth/callback/route.ts` : appel `/api/user/welcome` après `exchangeCodeForSession` réussi
- Modification `src/app/(app)/(public)/test/page.tsx` (ou composant) : bandeau de bienvenue conditionnel
- Dépendance Resend déjà installée
