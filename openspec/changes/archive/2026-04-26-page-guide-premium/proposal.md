## Why

L'UpsellGuide sur `/catalog` renvoie vers `/guide-premium` qui n'existe pas encore. Il faut une page de présentation du produit Guide Premium qui explique la valeur, affiche les tarifs, et permet de rejoindre la liste d'attente — en attendant l'intégration du paiement (Phase 2).

## What Changes

- Créer la page `/guide-premium` (Server Component public, accessible sans authentification)
- Page de présentation : proposition de valeur, bénéfices détaillés, tarifs mensuel/annuel
- Formulaire de liste d'attente : saisie email → stockage en DB ou envoi via Resend
- API `POST /api/guide-premium/waitlist` : enregistrement de l'email en liste d'attente
- Modèle Prisma `WaitlistEntry` : email, source, created_at
- Lien de retour contextuel (vers `/catalog` si authentifié, vers `/` sinon)

## Capabilities

### New Capabilities

- `guide-premium-landing` : page de présentation du Guide Premium avec tarifs, bénéfices, et inscription liste d'attente

### Modified Capabilities

- `guide-premium-catalog` : le lien CTA de UpsellGuide pointe vers `/guide-premium` (comportement déjà prévu, pas de changement d'exigence)

## Impact

- Nouveau fichier : `src/app/(app)/(public)/guide-premium/page.tsx`
- Nouvelle API : `src/app/api/guide-premium/waitlist/route.ts`
- Nouveau modèle Prisma : `WaitlistEntry` (migration requise)
- Dépendance Resend (déjà installée) pour confirmation email optionnelle
- Aucun impact sur les routes existantes
