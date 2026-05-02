## 1. Configuration et variables d'environnement

- [ ] 1.1 Créer un compte CinetPay sandbox sur cinetpay.com et récupérer `CINETPAY_API_KEY` et `CINETPAY_SITE_ID` (mode test)
- [ ] 1.2 Générer un secret HMAC webhook : `openssl rand -hex 32` → `CINETPAY_WEBHOOK_SECRET`
- [ ] 1.3 Ajouter dans `.env.local` : `CINETPAY_API_KEY`, `CINETPAY_SITE_ID`, `CINETPAY_WEBHOOK_SECRET`, `PAYMENT_AMOUNT_XOF=2000`
- [x] 1.4 Ajouter `/payment` aux `PROTECTED_ROUTES` dans `src/proxy.ts`

## 2. Wrapper CinetPay

- [x] 2.1 Créer `src/lib/cinetpay/index.ts` avec la fonction `initiateCinetPayPayment({ transactionId, amount, currency, description, returnUrl, notifyUrl })` qui appelle l'API CinetPay et retourne `payment_url`
- [x] 2.2 Créer `src/lib/cinetpay/verify-hmac.ts` avec la fonction `verifyCinetPaySignature(payload: string, signature: string, secret: string): boolean` utilisant `crypto.createHmac`

## 3. API Route — initiation du paiement

- [x] 3.1 Créer `src/app/api/payment/initiate/route.ts` (POST) : extraire l'`user_id` du JWT Supabase, valider le `score_id` (appartient à l'utilisateur), créer un `Payment(PENDING)` via Prisma
- [x] 3.2 Appeler `initiateCinetPayPayment()` avec `notifyUrl = /api/webhooks/cinetpay` et `returnUrl = /results`
- [x] 3.3 Retourner `{ payment_url }` en cas de succès, supprimer le Payment PENDING et retourner 502 en cas d'erreur CinetPay

## 4. API Route — webhook CinetPay

- [x] 4.1 Créer `src/app/api/webhooks/cinetpay/route.ts` (POST) : lire le body raw, vérifier la signature HMAC via `verifyCinetPaySignature`, retourner 401 si invalide
- [x] 4.2 Vérifier l'idempotence : si `psp_transaction_id` déjà en SUCCESS → retourner 200 immédiatement
- [x] 4.3 Traitement SUCCESS : transaction Prisma atomique — `Payment.update(SUCCESS)` + `PurchaseAccess.create({ expires_at: now + 6 mois })`
- [x] 4.4 Traitement FAILED/CANCELLED : `Payment.update(FAILED)` uniquement, pas de PurchaseAccess

## 5. Page de paiement

- [x] 5.1 Créer `src/app/(app)/(protected)/payment/page.tsx` : Server Component qui lit `score_id` depuis searchParams, valide qu'il appartient à l'utilisateur courant, affiche un message de redirection vers `/test` si absent
- [x] 5.2 Créer `src/components/features/payment/PaymentForm.tsx` (Client Component) : affiche le récapitulatif (prix XOF, modes de paiement Mobile Money), bouton "Payer maintenant" qui appelle `POST /api/payment/initiate` puis redirige vers `payment_url`
- [x] 5.3 Gérer les états de chargement et d'erreur dans `PaymentForm`

## 6. Déblocage des résultats

- [x] 6.1 Modifier `src/app/(app)/(public)/results/page.tsx` : après récupération de l'utilisateur, interroger Prisma pour vérifier si un `PurchaseAccess` actif (`expires_at > now()`) existe pour cet utilisateur
- [x] 6.2 Passer `hasAccess: boolean` comme prop à `ResultsClient`
- [x] 6.3 Modifier `ResultsClient.tsx` : accepter la prop `hasAccess`, si `true` afficher toutes les recommandations sans `PaywallSection`

## 7. Tests et vérification

- [ ] 7.1 Installer ngrok (`brew install ngrok`) et exposer `localhost:3000` pour tester les webhooks : `ngrok http 3000`
- [ ] 7.2 Mettre à jour `CINETPAY_WEBHOOK_URL` dans le dashboard CinetPay sandbox avec l'URL ngrok `https://xxx.ngrok.io/api/webhooks/cinetpay`
- [ ] 7.3 Tester le parcours complet : `/results` → clic paywall → `/payment` → paiement sandbox → webhook → `/results` avec accès complet
- [ ] 7.4 Tester le cas d'erreur : signature HMAC invalide → 401
- [ ] 7.5 Tester l'idempotence : envoyer deux fois le même webhook → deuxième appel ignoré
