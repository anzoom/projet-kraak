## ADDED Requirements

### Requirement: Variables d'environnement base de données configurées
Le fichier `.env.local` SHALL contenir `DATABASE_URL` (connexion PostgreSQL Supabase, port 5432) et `PAYLOAD_SECRET` (chaîne aléatoire ≥ 32 caractères) avant toute migration ou démarrage du serveur.

#### Scenario: Démarrage réussi avec variables configurées
- **WHEN** `.env.local` contient `DATABASE_URL` et `PAYLOAD_SECRET` valides
- **THEN** `npm run dev` démarre sans erreur `@payload-config` ni erreur de connexion base de données

#### Scenario: Erreur explicite si DATABASE_URL absente
- **WHEN** `DATABASE_URL` est absente ou vide dans `.env.local`
- **THEN** Payload CMS et Prisma refusent de démarrer avec un message d'erreur explicite sur la variable manquante

### Requirement: Migration Payload CMS exécutée avec succès
La commande `npx payload migrate` SHALL créer les tables Payload CMS (`opportunities`, `admin_users`, et tables internes Payload) sur la base Supabase PostgreSQL, sans erreur, avant l'exécution de la migration Prisma.

#### Scenario: Migration Payload initiale réussie
- **WHEN** `DATABASE_URL` est valide et `npx payload migrate` est exécuté sur une base vide
- **THEN** les tables Payload sont créées et la commande se termine avec un code de sortie 0

#### Scenario: Migration Payload idempotente
- **WHEN** `npx payload migrate` est exécuté une deuxième fois sur une base déjà migrée
- **THEN** aucune table n'est recréée et la commande se termine sans erreur

### Requirement: Migration Prisma exécutée avec succès
La commande `npx prisma migrate dev` SHALL créer les tables métier KRAAK (`users`, `test_responses`, `user_profile_scores`, `recommendations`, `payments`, `purchase_accesses`) après la migration Payload CMS.

#### Scenario: Migration Prisma initiale réussie
- **WHEN** la migration Payload est déjà appliquée et `npx prisma migrate dev --name init` est exécuté
- **THEN** les 6 tables métier sont créées et le client Prisma est généré

#### Scenario: Ordre de migration respecté
- **WHEN** `npx prisma migrate dev` est exécuté avant `npx payload migrate`
- **THEN** la documentation MUST indiquer clairement que l'ordre Payload → Prisma est obligatoire

### Requirement: Import map Payload CMS généré
La commande `npx payload generate:importMap` SHALL générer le fichier `src/app/(payload)/admin/importMap.js` requis par Webpack pour résoudre l'alias `@payload-config`.

#### Scenario: Build réussi après génération de l'import map
- **WHEN** `npx payload generate:importMap` est exécuté avec succès
- **THEN** `npm run dev` démarre sans erreur `Module not found: Can't resolve '@payload-config'`

#### Scenario: Régénération nécessaire après modification de payload.config.ts
- **WHEN** une nouvelle collection est ajoutée à `payload.config.ts`
- **THEN** `npx payload generate:importMap` MUST être relancé pour que les changements soient pris en compte au build
