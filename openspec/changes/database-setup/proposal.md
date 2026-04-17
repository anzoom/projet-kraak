## Why

L'application ne peut pas démarrer correctement en local ni en production sans une base de données configurée : Payload CMS plante au build (`@payload-config` non résolu) et les routes Prisma sont non fonctionnelles. Il faut initialiser les deux schémas (Drizzle via Payload CMS, puis Prisma) sur la base Supabase PostgreSQL pour rendre le produit testable de bout en bout.

## What Changes

- Création et configuration du fichier `.env.local` avec `DATABASE_URL` et `PAYLOAD_SECRET`
- Exécution de la migration Payload CMS (Drizzle) pour créer les tables `opportunities` et `admin_users`
- Exécution de la migration Prisma pour créer les tables métier (`users`, `test_responses`, `user_profile_scores`, `recommendations`, `payments`, `purchase_accesses`)
- Génération de l'import map Payload CMS pour résoudre l'erreur `@payload-config` au build
- Seed optionnel des opportunités dans Payload CMS pour tester le matching avec des données réelles

## Capabilities

### New Capabilities

- `database-config`: Configuration et initialisation des deux schémas de base de données (Payload/Drizzle + Prisma) sur Supabase PostgreSQL

### Modified Capabilities

*(aucune — aucun comportement fonctionnel existant ne change)*

## Impact

- Fichiers de configuration : `.env.local`, `payload.config.ts` (si ajustements nécessaires)
- Commandes de migration : `npx payload migrate`, `npx prisma migrate deploy`
- Résolution du build error Turbopack/Webpack (`@payload-config`)
- Débloque les tests locaux de bout en bout (parcours test → scoring → résultats)
