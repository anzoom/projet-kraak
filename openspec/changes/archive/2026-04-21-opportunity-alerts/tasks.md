## 1. Migration Prisma — alerts_enabled

- [x] 1.1 Dans `prisma/schema.prisma`, ajouter sur le modèle `User` : `alerts_enabled Boolean @default(false)`
- [x] 1.2 Lancer `export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && npx prisma migrate dev --name add-alerts-enabled`
- [x] 1.3 Vérifier que le client Prisma est régénéré et que `user.alerts_enabled` est typé

## 2. Route API — sauvegarde des réponses test

- [x] 2.1 Créer `src/app/api/user/save-test-response/route.ts` (POST) :
  - Extraire `supabase_uid` via `createSupabaseServerAnonClient().auth.getUser()`
  - Si non authentifié → 401
  - Body attendu : `{ answers: Record<string, string> }`
  - Upsert `User` Prisma par `supabase_uid` (créer si inexistant, avec `email` depuis Supabase user)
  - Créer un `TestResponse` : `prisma.testResponse.create({ data: { user_id, answers, completed: true } })`
  - Idempotence : vérifier si une `TestResponse` avec les mêmes answers JSON existe déjà avant de créer
  - Retourner `{ ok: true }`

## 3. Route API — toggle alertes

- [x] 3.1 Créer `src/app/api/user/alerts/route.ts` (POST) :
  - Extraire `supabase_uid` via `getUser()`
  - Si non authentifié → 401
  - Body attendu : `{ enabled: boolean }`
  - Upsert `User` puis `prisma.user.update({ where: { supabase_uid }, data: { alerts_enabled: enabled } })`
  - Retourner `{ alerts_enabled: boolean }`
- [x] 3.2 Créer `src/app/api/user/alerts/route.ts` (GET) :
  - Retourner `{ alerts_enabled: boolean }` pour l'utilisateur courant

## 4. Intégration dans ResultsClient — fire-and-forget

- [x] 4.1 Dans `src/components/features/results/ResultsClient.tsx`, dans le `useEffect` de chargement, après que `score` et `answers` sont disponibles ET si `isAuthenticated` :
  - Appeler `fetch("/api/user/save-test-response", { method: "POST", body: JSON.stringify({ answers }) })` sans `await` (fire-and-forget)
  - Envelopper dans un `try/catch` silencieux pour ne pas bloquer le rendu

## 5. Toggle alertes dans ProfileClient

- [x] 5.1 Dans `src/components/features/profile/ProfileClient.tsx` :
  - Ajouter un `useEffect` pour charger `GET /api/user/alerts` → état `alertsEnabled: boolean`
  - Ajouter un toggle switch (checkbox styled) dans la section "Mon compte" : "Recevoir les alertes email pour les nouvelles opportunités"
  - Au changement : appeler `POST /api/user/alerts` avec `{ enabled: !alertsEnabled }` et mettre à jour l'état local
  - Afficher un état de chargement (`saving`) pendant l'appel

## 6. Route API cron — envoi des alertes

- [x] 6.1 Ajouter `CRON_SECRET=<valeur-locale>` dans `.env.local` (et documenter dans `.env.example` si présent)
- [x] 6.2 Créer `src/app/api/cron/send-alerts/route.ts` (GET) :
  - Vérifier `Authorization: Bearer <CRON_SECRET>` — si absent/incorrect → 401
  - Récupérer tous les users avec `alerts_enabled: true` et leur dernière `TestResponse` via Prisma
  - Pour chaque user : parser `testResponse.answers`, appeler `matchOpportunities()` avec les opportunités du seed, prendre les 3 premières
  - Si aucune recommandation → skip l'utilisateur
  - Construire et envoyer l'email via Resend :
    ```ts
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "KRAAK <alertes@kraak.co>",
      to: user.email,
      subject: "3 opportunités correspondent à ton profil",
      html: buildAlertEmailHtml(recommendations, user.email),
    })
    ```
  - Retourner `{ sent: number, skipped: number }`
- [x] 6.3 Créer la fonction `buildAlertEmailHtml(recommendations, email)` dans le même fichier :
  - HTML inline simple : titre, 3 cards (titre, catégorie, pays, deadline, lien source_url), CTA `/results`, footer de désinscription

## 7. Vérification

- [x] 7.1 Lancer `npx tsc --noEmit` — zéro erreur TypeScript sur notre code (erreurs pré-existantes sur .next/types et e2e fixtures)
- [x] 7.2 Lancer `npx vitest run` — zéro régression (57 tests passent)
- [ ] 7.3 Test manuel : visiter `/results` en étant connecté, vérifier dans les logs Prisma que la TestResponse est créée
- [ ] 7.4 Test manuel : toggle alertes dans `/dashboard` — vérifier que `alerts_enabled` bascule en DB
- [ ] 7.5 Test manuel : appeler `GET /api/cron/send-alerts` avec le header `Authorization: Bearer <CRON_SECRET>` — vérifier le retour `{ sent, skipped }`
