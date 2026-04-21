## 1. Débloquer les résultats pour tout utilisateur authentifié

- [x] 1.1 Dans `src/app/(app)/(public)/results/page.tsx`, remplacer la requête `PurchaseAccess` par `hasAccess = prismaUser !== null` — supprimer l'appel `prisma.purchaseAccess.findFirst()`

## 2. Remplacer le CTA paywall par une invitation à créer un compte

- [x] 2.1 Dans `src/components/features/results/PaywallSection.tsx`, remplacer le contenu par le wording validé :
  - Titre : "Ton profil est unique — tes opportunités aussi"
  - Corps : "On a trouvé **{count} opportunités** qui te correspondent vraiment. Crée ton compte gratuit pour les découvrir — ça ne prend qu'une minute."
  - Bouton primaire : "Je crée mon compte gratuit →" → `href="/auth/register"`
  - Lien secondaire : "Déjà un compte ? Se connecter" → `href="/auth/login"`
- [x] 2.2 Passer `count={locked.length + FREE_LIMIT}` (ou équivalent) comme prop à `PaywallSection` depuis `ResultsClient.tsx` pour afficher le nombre réel d'opportunités

## 3. Supprimer le code CinetPay

- [x] 3.1 Supprimer `src/lib/cinetpay/` (dossier entier)
- [x] 3.2 Supprimer `src/app/api/payment/initiate/` (dossier)
- [x] 3.3 Supprimer `src/app/api/payment/revoke/` (dossier, si présent)
- [x] 3.4 Supprimer `src/app/api/webhooks/cinetpay/` (dossier)
- [x] 3.5 Supprimer `src/app/(app)/(protected)/payment/` (dossier)
- [x] 3.6 Supprimer `src/components/features/payment/PaymentForm.tsx`

## 4. Nettoyer la configuration

- [x] 4.1 Dans `src/proxy.ts`, retirer `"/payment"` du tableau `PROTECTED_ROUTES`
- [x] 4.2 Dans `src/proxy.ts`, retirer `"/api/payment/"` du tableau `RATE_LIMITED_ROUTES`

## 5. Vérification

- [x] 5.1 Lancer `npx tsc --noEmit` — zéro erreur TypeScript
- [x] 5.2 Vérifier que `/results` affiche toutes les recommandations pour un utilisateur connecté
- [x] 5.3 Vérifier que `/results` affiche le nouveau bloc paywall avec le CTA d'inscription pour un utilisateur non connecté
- [x] 5.4 Vérifier que le clic sur "Je crée mon compte gratuit →" redirige vers `/auth/register`
