## Why

KRAAK vient d'implémenter le paiement CinetPay, mais la priorité stratégique a évolué : avant de monétiser, il faut faire connaître l'application et constituer une base d'utilisateurs. Le paywall actuel crée une friction qui bloque l'adoption — un utilisateur qui arrive pour la première fois ne paiera pas avant d'avoir confiance dans la valeur du produit.

La stratégie MVP passe en mode croissance : accès gratuit aux résultats complets en échange de la création d'un compte. Le compte devient l'actif central pour le tunnel de vente futur (email marketing, upsell, alertes personnalisées).

## What Changes

- Modification de `/results` : `hasAccess` devient `true` dès qu'un utilisateur est authentifié (plus conditionné à un `PurchaseAccess` en base)
- Remplacement du CTA paywall paiement par un CTA d'inscription chaleureux : "Ton profil est unique — tes opportunités aussi"
- Suppression complète du code CinetPay : wrapper `src/lib/cinetpay/`, routes API `/api/payment/initiate` et `/api/webhooks/cinetpay`, page `/payment`, composant `PaymentForm`
- Les tables Prisma `Payment` et `PurchaseAccess` sont conservées en base pour la monétisation future

## Capabilities

### Modified Capabilities
- `results-display` : `hasAccess` conditionné à l'authentification — CTA paywall remplacé par invitation à créer un compte
- `payment-initiation` : supprimée — la page `/payment` et l'API `/api/payment/initiate` sont retirées
- `payment-webhook` : supprimée — le webhook CinetPay est retiré

## Impact

- Modification : `src/app/(app)/(public)/results/page.tsx` (logique `hasAccess`)
- Modification : `src/components/features/results/PaywallSection.tsx` (CTA + wording)
- Suppression : `src/lib/cinetpay/`
- Suppression : `src/app/api/payment/`
- Suppression : `src/app/api/webhooks/cinetpay/`
- Suppression : `src/app/(app)/(protected)/payment/`
- Suppression : `src/components/features/payment/PaymentForm.tsx`
- Modification mineure : `src/proxy.ts` (retirer `/payment` des `PROTECTED_ROUTES`)
