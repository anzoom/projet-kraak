## Why

KRAAK n'existe pas encore en tant qu'application. Ce changement pose les fondations techniques indispensables au lancement du MVP : projet Next.js configuré, base de données opérationnelle, authentification fonctionnelle, back-office admin, et pipeline CI/CD. Sans ces fondations, aucune fonctionnalité produit ne peut être construite.

## What Changes

- Création du projet Next.js 14 (App Router) avec TypeScript strict et Tailwind CSS
- Configuration de Supabase (3 projets : dev, staging, prod) avec Supabase Auth pour les utilisateurs
- Intégration de Prisma avec le schéma métier complet (User, TestResponse, UserProfileScore, Recommendation, Payment, PurchaseAccess)
- Intégration de Payload CMS 3 en mode embarqué (même déploiement Next.js) avec les collections Opportunity et AdminUser
- Middleware d'authentification Next.js séparant les routes Supabase (`/dashboard`, `/results`) des routes Payload (`/admin/**`)
- Configuration Vercel avec déploiements automatiques sur branches `staging` et `main`
- Pipeline CI/CD GitHub Actions : lint, typecheck, tests Vitest, build, deploy preview

## Capabilities

### New Capabilities

- `nextjs-app-setup`: Projet Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui, structure de dossiers selon ARCHITECTURE.md
- `supabase-auth`: Authentification utilisateurs via Supabase Auth (email/password, JWT HttpOnly cookies)
- `prisma-schema`: Schéma Prisma complet des entités métier avec migrations versionnées sur PostgreSQL Supabase
- `payload-cms-admin`: Back-office admin Payload CMS 3 embarqué avec collections Opportunity et AdminUser, auth RBAC séparée
- `auth-middleware`: Middleware Next.js gérant la séparation stricte entre JWT Supabase (routes user) et JWT Payload (routes admin)
- `ci-cd-pipeline`: Pipeline GitHub Actions + déploiement Vercel multi-environnements (dev/staging/prod)

### Modified Capabilities

*(Aucun — projet initialisé depuis zéro)*

## Impact

- **Code** : création de l'intégralité de la structure `src/` selon ARCHITECTURE.md section 5
- **Base de données** : 6 tables Prisma (métier) + tables Payload CMS sur PostgreSQL Supabase
- **Dépendances** : next, typescript, tailwindcss, @supabase/supabase-js, prisma, @payloadcms/next, payload, drizzle-orm, zod, react-hook-form, zustand
- **Infrastructure** : 3 projets Supabase, 1 projet Vercel avec 3 environnements, secrets GitHub Actions
- **Ordre de migration impératif** : `npx payload migrate` avant `npx prisma migrate deploy` à chaque déploiement
