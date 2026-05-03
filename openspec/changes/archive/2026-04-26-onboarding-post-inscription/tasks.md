## 1. Modèle de données

- [x] 1.1 Ajouter le champ `welcome_sent Boolean @default(false)` sur le modèle `User` dans `prisma/schema.prisma`
- [x] 1.2 Créer le fichier de migration SQL `prisma/migrations/20260426110000_add_welcome_sent/migration.sql`
- [x] 1.3 Exécuter `prisma generate` pour régénérer le client Prisma
- [x] 1.4 Appliquer la migration avec `prisma migrate deploy`

## 2. API /api/user/welcome

- [x] 2.1 Créer `src/app/api/user/welcome/route.ts` (POST) : extraire `user_id` du JWT Supabase, `upsert` l'entrée `User`, vérifier `welcome_sent`, envoyer l'email via Resend, mettre `welcome_sent = true`
- [x] 2.2 Implémenter le template HTML de l'email de bienvenue dans la même route (fonction `buildWelcomeEmailHtml`)

## 3. Déclenchement depuis RegisterForm

- [x] 3.1 Dans `RegisterForm.tsx` : après inscription réussie avec session immédiate et sans `?from=test`, appeler `POST /api/user/welcome` (fire-and-forget) et rediriger vers `/test?welcome=1`
- [x] 3.2 Dans `RegisterForm.tsx` : après inscription réussie avec session immédiate et avec `?from=test`, appeler `POST /api/user/welcome` (fire-and-forget) avant la redirection vers `/results`
- [x] 3.3 Dans `RegisterForm.tsx` : pour les sessions différées sans `?from=test`, passer `emailRedirectTo` avec `?next=/test&welcome=1`

## 4. Déclenchement depuis le callback d'auth

- [x] 4.1 Dans `/auth/callback/route.ts` : après `exchangeCodeForSession` réussi, appeler `POST /api/user/welcome` via fetch interne (await, < 500ms) avant la redirection

## 5. Bandeau de bienvenue

- [x] 5.1 Dans la page `/test`, lire le paramètre `?welcome=1` et afficher un bandeau de bienvenue contextuel si présent
