## Context

Le projet KRAAK utilise deux ORM sur la même base PostgreSQL Supabase :
- **Payload CMS / Drizzle** : tables CMS (`opportunities`, `admin_users`) — migrations gérées par `npx payload migrate`
- **Prisma** : tables métier (`users`, `test_responses`, `user_profile_scores`, `recommendations`, `payments`, `purchase_accesses`) — migrations gérées par `npx prisma migrate deploy`

Actuellement, `.env.local` ne contient pas `DATABASE_URL` ni `PAYLOAD_SECRET`, ce qui empêche le build de démarrer (`@payload-config` non résolu par Webpack) et bloque tout test local.

## Goals / Non-Goals

**Goals :**
- Documenter les étapes exactes pour configurer `.env.local` (DATABASE_URL, PAYLOAD_SECRET)
- Exécuter les migrations Payload CMS puis Prisma dans le bon ordre
- Générer l'import map Payload CMS pour résoudre l'erreur de build
- Optionnellement : créer le premier admin Payload et saisir des opportunités de test

**Non-Goals :**
- Configurer Supabase Auth (déjà fait dans le change `user-auth`)
- Mettre en place Supabase en local (on utilise le projet Supabase cloud existant)
- Configurer les autres variables d'environnement (CinetPay, Upstash, PostHog, Sentry)

## Decisions

### D1 — Ordre de migration : Payload d'abord, Prisma ensuite

Payload CMS crée ses propres tables via Drizzle. Prisma ne doit pas toucher ces tables. L'ordre `payload migrate` → `prisma migrate deploy` évite les conflits de schéma. C'est l'ordre documenté dans `CLAUDE.md`.

Alternative écartée : migration Prisma en premier → risque de conflits sur les séquences PostgreSQL partagées.

### D2 — Utiliser `prisma migrate dev` en local, `migrate deploy` en prod

En local, `prisma migrate dev` crée les fichiers de migration manquants et les applique. En production/staging, `migrate deploy` applique uniquement les migrations existantes sans en créer de nouvelles.

### D3 — Générer l'import map Payload avant `npm run dev`

Payload CMS v3 exige que `src/app/(payload)/admin/importMap.js` existe avant le démarrage Webpack. La commande `npx payload generate:importMap` crée ce fichier. Sans lui, `@payload-config` reste non résolu même avec webpack (sans Turbopack).

### D4 — `PAYLOAD_SECRET` généré localement avec openssl

Une chaîne aléatoire ≥ 32 caractères suffit pour le dev. En production, elle doit être stockée comme secret Vercel et ne jamais changer (changerait les sessions admin actives).

## Risks / Trade-offs

- **[Risque] DATABASE_URL incorrecte** → Mitigation : tester avec `npx prisma db pull` avant les migrations pour valider la connexion
- **[Risque] Payload migrate échoue si PAYLOAD_SECRET absent** → Mitigation : vérifier `.env.local` avant de lancer les migrations
- **[Risque] `prisma migrate dev` crée une migration vide** → Mitigation : si le schéma correspond déjà à la base, la commande ne crée rien — comportement normal
- **[Risque] `importMap.js` non régénéré après ajout de collection Payload** → Mitigation : relancer `npx payload generate:importMap` à chaque modification de `payload.config.ts`

## Migration Plan

1. Récupérer `DATABASE_URL` depuis Supabase Dashboard → Settings → Database → URI (port 5432)
2. Générer `PAYLOAD_SECRET` : `openssl rand -base64 32`
3. Ajouter les deux variables dans `.env.local`
4. Lancer `npx payload migrate` (crée tables Payload/Drizzle)
5. Lancer `npx prisma migrate dev --name init` (crée et applique la migration Prisma initiale)
6. Lancer `npx payload generate:importMap` (génère `importMap.js`)
7. Lancer `npm run dev` — le build doit passer sans erreur `@payload-config`

**Rollback :** En cas de problème, supprimer toutes les tables via le dashboard Supabase (SQL Editor : `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`) et recommencer.
