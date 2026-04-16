## 1. Initialisation du projet Next.js

- [x] 1.1 Créer le projet avec `npx create-next-app@latest kraak --typescript --tailwind --app --src-dir --import-alias "@/*"`
- [x] 1.2 Configurer `tsconfig.json` en mode strict (`"strict": true`)
- [x] 1.3 Créer la structure de dossiers complète selon ARCHITECTURE.md section 5 : `src/app/(public)`, `src/app/(protected)`, `src/app/(payload)`, `src/domain/scoring/`, `src/domain/matching/`, `src/collections/`, `src/lib/supabase/`, `src/lib/prisma/`, `src/lib/cinetpay/`, `src/lib/upstash/`, `src/lib/posthog/`, `src/components/ui/`, `src/components/features/test/`, `src/components/features/results/`, `src/components/features/paywall/`
- [x] 1.4 Installer shadcn/ui et initialiser (`npx shadcn@latest init`) — components.json configuré pour Tailwind v4 + cn() utility créée
- [x] 1.5 Installer les dépendances de base : `react-hook-form`, `zod`, `zustand`
- [ ] 1.6 Vérifier que `tsc --noEmit` et `npm run build` passent sans erreur — à faire après `npm install` complet

## 2. Provisionnement Supabase

- [ ] 2.1 Créer 3 projets Supabase (dev, staging, prod) sur supabase.com
- [ ] 2.2 Récupérer pour chaque projet : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (avec pooler pour prod/staging)
- [ ] 2.3 Renseigner les variables dans `.env.local` pour l'environnement dev

## 3. Prisma — schéma et migrations

- [x] 3.1 Installer Prisma : `npm install prisma @prisma/client` (v5.22)
- [x] 3.2 Initialiser Prisma : dossier `prisma/` créé manuellement (init refusé car dossier existait)
- [x] 3.3 Écrire `prisma/schema.prisma` avec les modèles exacts de ARCHITECTURE.md section 4 : `User`, `TestResponse`, `UserProfileScore`, `Recommendation`, `Payment`, `PurchaseAccess`, enum `PaymentStatus`
- [x] 3.4 S'assurer que `Payment.amount` est de type `Int` (pas Float) ✓
- [x] 3.5 Créer le singleton Prisma client dans `src/lib/prisma/index.ts` (pattern `globalThis` pour hot-reload)
- [ ] 3.6 Générer et appliquer la migration initiale : `npx prisma migrate dev --name init` — à faire après 2.3
- [ ] 3.7 Vérifier avec `npx prisma validate` et `npx prisma studio` que les tables sont créées correctement — à faire après 3.6

## 4. Intégration Payload CMS 3

- [ ] 4.1 Installer Payload CMS : `npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical` — voir section "npm install" ci-dessous
- [x] 4.2 Créer `payload.config.ts` à la racine avec adaptateur PostgreSQL (Drizzle), `PAYLOAD_SECRET`, et les collections
- [x] 4.3 Définir la collection `Opportunity` dans `src/collections/Opportunities.ts` avec tous les champs de PRD section 9.2
- [x] 4.4 Définir la collection `AdminUser` dans `src/collections/AdminUsers.ts` avec RBAC (auth: true)
- [x] 4.5 Exporter les collections dans `src/collections/index.ts` et les référencer dans `payload.config.ts`
- [x] 4.6 Créer la route Payload dans `src/app/(payload)/admin/[[...segments]]/page.tsx`
- [x] 4.7 Ajouter le handler Payload API dans `src/app/api/[...payload]/route.ts`
- [ ] 4.8 Exécuter `npx payload migrate` pour créer les tables CMS en base — à faire après 2.3 et 4.1
- [ ] 4.9 Vérifier que `/admin` est accessible et qu'un compte AdminUser peut être créé — à faire après 4.8

## 5. Supabase Auth — clients et bibliothèque

- [ ] 5.1 Installer `@supabase/supabase-js` et `@supabase/ssr` — voir section "npm install" ci-dessous
- [x] 5.2 Créer le client serveur dans `src/lib/supabase/server.ts` (utilise `SUPABASE_SERVICE_ROLE_KEY`)
- [x] 5.3 Créer le client navigateur dans `src/lib/supabase/client.ts` (utilise `NEXT_PUBLIC_SUPABASE_ANON_KEY` uniquement)
- [ ] 5.4 Vérifier que `SUPABASE_SERVICE_ROLE_KEY` n'apparaît pas dans le bundle client Next.js — à faire après build

## 6. Middleware d'authentification

- [x] 6.1 Créer `src/middleware.ts` avec la logique de séparation : routes `/admin/**` → `NextResponse.next()` sans vérification Supabase
- [x] 6.2 Implémenter la vérification JWT Supabase pour les routes protégées (`/dashboard`, `/results`, `/results/[scoreId]`)
- [x] 6.3 Configurer le `matcher` dans le middleware pour exclure les assets statiques et les routes publiques
- [ ] 6.4 Installer Upstash Redis : `npm install @upstash/ratelimit @upstash/redis` — voir section "npm install" ci-dessous
- [x] 6.5 Créer le wrapper rate-limiting dans `src/lib/upstash/index.ts`
- [x] 6.6 Appliquer le rate-limiting dans le middleware sur `/auth/**` et dans les routes API `/api/payment/**`
- [ ] 6.7 Tester manuellement : route non authentifiée `/dashboard` → redirect `/auth/login`, route `/admin` → page login Payload — à faire après `npm run dev`

## 7. Configuration Vercel et GitHub Actions

- [ ] 7.1 Créer le projet Vercel et lier le dépôt GitHub
- [ ] 7.2 Configurer les 3 environnements Vercel (development, preview/staging, production) avec leurs variables d'environnement respectives
- [x] 7.3 Créer `.github/workflows/ci.yml` : job `check` (lint + `tsc --noEmit` + Vitest + `next build`) déclenché sur pull_request vers `main` et `staging`
- [x] 7.4 Créer `.github/workflows/deploy.yml` : job `deploy` déclenché sur push vers `main` — exécute `npx payload migrate` puis `npx prisma migrate deploy` puis déploiement Vercel production
- [ ] 7.5 Ajouter les secrets GitHub Actions : `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, et les variables Supabase/Payload/CinetPay pour staging et prod
- [ ] 7.6 Vérifier qu'une PR déclenche le workflow CI et qu'un merge sur `main` déclenche le deploy prod

## 8. Vérification finale des fondations

- [ ] 8.1 Exécuter `tsc --noEmit` — zéro erreur TypeScript
- [ ] 8.2 Exécuter `npm run build` — build Next.js réussi
- [ ] 8.3 Vérifier que `/admin` est accessible en local et qu'un AdminUser peut se connecter
- [ ] 8.4 Vérifier que `npx prisma migrate status` ne signale aucune migration en attente
- [x] 8.5 Vérifier que `.env.local` est bien dans `.gitignore` et non tracké par git ✓
- [x] 8.6 Vérifier que `.env.example` contient toutes les variables de ARCHITECTURE.md section 6 ✓
