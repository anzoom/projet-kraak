## 1. Configuration des variables d'environnement

- [x] 1.1 Récupérer la `DATABASE_URL` depuis Supabase Dashboard → Settings → Database → Connection string (URI, port 5432) et l'ajouter dans `.env.local`
- [x] 1.2 Générer `PAYLOAD_SECRET` avec `openssl rand -base64 32` et l'ajouter dans `.env.local`
- [x] 1.3 Vérifier la connexion à la base avec `npx prisma db pull` — doit retourner le schéma sans erreur

## 2. Migrations base de données

- [x] 2.1 Exécuter `npx payload migrate` pour créer les tables Payload CMS (opportunities, admin_users, tables internes) — tables déjà créées, baseline effectuée
- [x] 2.2 Exécuter `npx prisma migrate dev --name init` pour créer les tables métier KRAAK et générer le client Prisma — effectué via `migrate deploy` après création manuelle du fichier SQL

## 3. Génération de l'import map Payload CMS

- [x] 3.1 Exécuter `npx payload generate:importMap` pour générer `src/app/(payload)/admin/importMap.js`
- [x] 3.2 Vérifier que `npm run dev` démarre sans erreur `Module not found: Can't resolve '@payload-config'`

## 4. Vérification du parcours complet

- [x] 4.1 Accéder à `/test`, compléter le questionnaire, créer un compte → vérifier la redirection vers page confirmation email (Supabase email confirmation activée)
- [x] 4.2 Accéder à `http://localhost:3000/admin`, créer un compte admin Payload et se connecter — admin opérationnel (admin@kraak.app)
- [x] 4.3 Créer une opportunité de test dans Payload CMS et vérifier qu'elle apparaît dans le matching sur `/results` — 3 opportunités créées, matching fonctionnel (Bourse AFD #1 à 65 pts, accès public ajouté à la collection)
