## Context

Le schéma Prisma (`Payment`, `PurchaseAccess`, `PaymentStatus`) est déjà en base. L'architecture définit précisément le flux : initiate → CinetPay → webhook → PurchaseAccess. Les variables d'env CinetPay (`CINETPAY_API_KEY`, `CINETPAY_SITE_ID`, `CINETPAY_WEBHOOK_SECRET`) sont à ajouter dans `.env.local`. Le rate limiting Upstash est déjà configuré sur `/api/payment/**` dans `proxy.ts`.

**Prix MVP :** à définir — l'architecture mentionne un prix en FCFA mais ne le fixe pas. On utilisera **2 000 XOF** comme valeur par défaut (modifiable via env var `PAYMENT_AMOUNT_XOF`).

## Goals / Non-Goals

**Goals:**
- Permettre le paiement Mobile Money via CinetPay
- Créer un `PurchaseAccess` valide 6 mois après paiement réussi
- Débloquer toutes les recommandations sur `/results` pour l'utilisateur ayant payé
- Sécuriser le webhook HMAC + idempotence

**Non-Goals:**
- Remboursement programmatique (manuel via dashboard CinetPay — hors MVP)
- Abonnement récurrent
- Plusieurs niveaux de prix
- NotchPay (alternative, hors MVP)

## Decisions

### D1 — `user_id` extrait du JWT serveur uniquement
**Décision :** Dans `POST /api/payment/initiate`, l'`user_id` est toujours extrait du JWT Supabase côté serveur — jamais du body de la requête.
**Rationale :** Protection IDOR obligatoire (CLAUDE.md).

### D2 — Prix en constante serveur avec env var optionnelle
**Décision :** `const AMOUNT = parseInt(process.env.PAYMENT_AMOUNT_XOF ?? "2000", 10)` dans l'API route.
**Rationale :** Permet d'ajuster le prix sans redéploiement, tout en gardant une valeur par défaut raisonnable.

### D3 — Vérification HMAC via `crypto.createHmac` Node.js natif
**Décision :** Pas de dépendance externe — utiliser `crypto` natif pour vérifier `X-CinetPay-Signature` (ou équivalent selon la doc CinetPay).
**Rationale :** Zéro dépendance supplémentaire, disponible dans Node.js Edge Runtime.

### D4 — PurchaseAccess vérifié server-side sur `/results`
**Décision :** `ResultsPage` (Server Component) vérifie le PurchaseAccess via Prisma avant de passer `hasAccess` à `ResultsClient`. Pas de vérification côté client.
**Rationale :** Évite toute manipulation client — l'accès ne peut pas être forgé depuis le navigateur.

### D5 — Page `/payment` sous `(protected)` (auth requise)
**Décision :** `/payment` est placée sous `src/app/(app)/(protected)/` — le middleware Supabase exige une session active.
**Rationale :** On ne peut pas payer sans être connecté. Le middleware redirige vers `/auth/login?next=/payment` si non connecté.

### D6 — `score_id` passé dans l'état de la page /payment
**Décision :** La page `/payment` reçoit le `score_id` via un paramètre query (`?score_id=xxx`) pour associer le PurchaseAccess au bon profil. Le score_id est validé server-side (appartient bien à l'utilisateur courant).
**Rationale :** Permet de lier l'accès aux recommandations spécifiques du test passé.

## Risks / Trade-offs

- **CinetPay sandbox** → En dev, utiliser les credentials sandbox CinetPay. Les paiements sandbox ne déclenchent pas de vrais débits.
- **Webhook non reçu en dev** → CinetPay ne peut pas appeler `localhost`. Utiliser `ngrok` ou tester le webhook manuellement via `curl`. Documenter dans les tâches.
- **`score_id` absent** → Si l'utilisateur arrive sur `/payment` sans `score_id`, afficher un message "Refais le test d'abord" et rediriger vers `/test`.
- **Doublon de paiement** → L'idempotence sur `psp_transaction_id` protège contre le double traitement webhook.

## Migration Plan

1. Ajouter les variables d'env CinetPay dans `.env.local`
2. Créer le wrapper `src/lib/cinetpay/`
3. Créer `POST /api/payment/initiate`
4. Créer `POST /api/webhooks/cinetpay`
5. Créer la page `/payment`
6. Modifier `/results` pour vérifier le PurchaseAccess
7. Tester en sandbox avec ngrok pour le webhook
8. Ajouter `/payment` aux PROTECTED_ROUTES dans `proxy.ts`
