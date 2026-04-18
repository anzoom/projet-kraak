## Why

Le paywall KRAAK affiche déjà les recommandations verrouillées et un CTA vers `/payment`, mais cette route n'existe pas — le clic aboutit à une page 404. Implémenter le paiement CinetPay (Mobile Money) est la fonctionnalité de monétisation centrale du MVP : sans elle, aucun revenu n'est possible.

## What Changes

- Création de la page `/payment` avec résumé des recommandations verrouillées et bouton "Payer"
- Création de `POST /api/payment/initiate` : crée un Payment(PENDING) en base et retourne l'URL de paiement CinetPay
- Création de `POST /api/webhooks/cinetpay` : vérifie la signature HMAC, gère l'idempotence, crée un PurchaseAccess(6 mois) en cas de succès
- Création du wrapper `src/lib/cinetpay/` (initiate, verify HMAC)
- Modification de `/results` : vérifie le PurchaseAccess serveur-side et déverrouille toutes les recommandations si actif
- Page de confirmation après paiement réussi

## Capabilities

### New Capabilities
- `payment-initiation`: Page /payment + endpoint POST /api/payment/initiate — démarrer une transaction CinetPay Mobile Money
- `payment-webhook`: Endpoint POST /api/webhooks/cinetpay — vérification HMAC, idempotence, création PurchaseAccess

### Modified Capabilities
- `results-display`: Vérification server-side du PurchaseAccess — affichage complet ou partiel selon l'accès

## Impact

- Nouvelles routes : `src/app/(app)/(protected)/payment/page.tsx`, `src/app/api/payment/initiate/route.ts`, `src/app/api/webhooks/cinetpay/route.ts`
- Nouveau lib : `src/lib/cinetpay/index.ts` (wrapper API + HMAC)
- Modification : `src/app/(app)/(public)/results/page.tsx` + `ResultsClient.tsx`
- Variables d'env : `CINETPAY_API_KEY`, `CINETPAY_SITE_ID`, `CINETPAY_WEBHOOK_SECRET`
- Tables Prisma utilisées : `Payment`, `PurchaseAccess` (déjà créées en migration)
- Rate limiting Upstash déjà configuré sur `/api/payment/**`
