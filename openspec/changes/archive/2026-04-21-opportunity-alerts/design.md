## Context

Le modèle `User` Prisma est alimenté lors de l'inscription (via Supabase Auth webhook ou lookup). La table `TestResponse` existe mais n'est jamais écrite. Le client Prisma est disponible via `src/lib/prisma/index.ts`. Resend est installé (`RESEND_API_KEY` dans `.env.local`) mais pas encore utilisé pour les emails produit.

L'architecture impose que `user_id` soit toujours extrait du JWT serveur — jamais du body de la requête. Les routes API `/api/user/*` doivent donc appeler `supabase.auth.getUser()` pour obtenir le `supabase_uid` puis faire un `prisma.user.findUnique({ where: { supabase_uid } })`.

## Goals / Non-Goals

**Goals :**
- Persistance des réponses test en base (`TestResponse`) lors de la visite de `/results` si authentifié
- Champ `alerts_enabled` sur `User` (migration Prisma)
- Toggle dans `/dashboard` pour s'abonner / se désabonner
- Endpoint `/api/cron/send-alerts` envoyant les 3 meilleures opportunités matching à chaque abonné

**Non-Goals :**
- Détection de "nouvelles" opportunités (on envoie le top matching actuel, pas uniquement les nouvelles)
- Planification automatique (le cron est appelé manuellement ou via Vercel Cron — non configuré dans ce change)
- Personnalisation de la fréquence des alertes (hebdomadaire par défaut)

## Decisions

### D1 — Persistance des réponses : fire-and-forget dans ResultsClient
**Décision :** Dans `ResultsClient`, quand `isAuthenticated === true` et que des réponses existent dans localStorage, appeler `POST /api/user/save-test-response` en arrière-plan (sans attendre la réponse). L'appel est idempotent côté serveur.
**Rationale :** Ne bloque pas le chargement des résultats. L'idempotence est assurée par un upsert sur `(user_id, hash des answers)` pour éviter les doublons.

### D2 — Modèle User : lookup par supabase_uid
**Décision :** Les routes `/api/user/*` font `prisma.user.findUnique({ where: { supabase_uid } })` après avoir extrait `supabase_uid` du JWT. Si l'utilisateur Prisma n'existe pas encore (edge case : inscription récente), le créer (upsert).
**Rationale :** Garantit que le User Prisma est toujours créé avant toute opération — sans dépendre d'un webhook d'inscription.

### D3 — Migration Prisma : alerts_enabled
**Décision :** Ajouter `alerts_enabled Boolean @default(false)` sur le modèle `User`. Migration : `npx prisma migrate dev --name add-alerts-enabled`.
**Rationale :** Champ simple, pas de table séparée nécessaire pour le MVP.

### D4 — Cron protégé par CRON_SECRET
**Décision :** `/api/cron/send-alerts` vérifie `Authorization: Bearer <CRON_SECRET>` dans le header. Si absent ou incorrect, retourne 401.
**Rationale :** Évite l'appel non autorisé en production. Vercel Cron passera ce header automatiquement si configuré.

### D5 — Email : Resend avec template HTML inline
**Décision :** Générer le HTML directement dans la route (pas de template React Email pour le MVP). Structure : titre, 3 cards d'opportunités (titre, catégorie, pays, deadline, lien "Postuler →"), CTA "Voir toutes mes recommandations" → `${BASE_URL}/results`.
**Rationale :** React Email ajoute une dépendance. Pour le MVP, un HTML inline suffit et reste maintenable.

### D6 — Limite de 3 opportunités dans l'email
**Décision :** L'email contient les 3 premières recommandations issues du matching (même algorithme que la page résultats).
**Rationale :** Garde l'email court et actionnable. Crée de la curiosité pour les opportunités restantes (CTA "Voir toutes mes recommandations").

## Risks / Trade-offs

- **RESEND_API_KEY vide** : en développement, l'envoi est skippé avec un log `[DEV] email non envoyé`. En production, s'assurer que la variable est renseignée.
- **User Prisma inexistant** : l'upsert dans D2 crée l'utilisateur au besoin, mais nécessite que `prisma.user.upsert` soit utilisé systématiquement.
- **Answers dans localStorage uniquement** : si l'utilisateur vide son cache avant de visiter `/results` après l'inscription, les réponses ne seront pas sauvegardées. Acceptable pour le MVP.

## Migration Plan

1. Modifier `prisma/schema.prisma` — ajouter `alerts_enabled`
2. Lancer `npx prisma migrate dev --name add-alerts-enabled`
3. Créer `/api/user/save-test-response/route.ts`
4. Créer `/api/user/alerts/route.ts`
5. Modifier `ResultsClient.tsx` — fire-and-forget save
6. Modifier `ProfileClient.tsx` — toggle alertes
7. Créer `/api/cron/send-alerts/route.ts`
8. Ajouter `CRON_SECRET` dans `.env.local`
