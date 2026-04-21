## Context

Le code CinetPay est implémenté et fonctionnel mais non encore testé en production. Le changement est un retrait propre — pas un refactor. La logique `hasAccess` dans `results/page.tsx` est en un seul endroit, ce qui rend le changement minimal et sûr. Les tables Prisma `Payment` et `PurchaseAccess` restent intactes pour éviter toute migration de base de données.

## Goals / Non-Goals

**Goals :**
- Accès aux résultats complets pour tout utilisateur authentifié (compte Supabase valide)
- Invitation à créer un compte pour les utilisateurs non authentifiés (remplace le paywall de paiement)
- Code CinetPay supprimé proprement sans laisser de références mortes
- Zéro régression sur le parcours test → résultats

**Non-Goals :**
- Modifier le schema Prisma ou faire des migrations DB
- Changer l'expérience des utilisateurs déjà connectés (pas d'impact visible)
- Implémenter un nouveau système de monétisation (hors scope)

## Decisions

### D1 — `hasAccess = !!prismaUser` (auth suffit)
**Décision :** Dans `results/page.tsx`, remplacer la requête `PurchaseAccess` par `hasAccess = prismaUser !== null`.
**Rationale :** Minimaliste — un utilisateur avec un compte Supabase valide a toujours un enregistrement `prismaUser`. Pas besoin d'une nouvelle table ou d'un nouveau champ.

### D2 — Wording chaleureux validé par l'utilisateur
**Décision :** Le bloc paywall affiche :
- Titre : "Ton profil est unique — tes opportunités aussi"
- Corps : "On a trouvé X opportunités qui te correspondent vraiment. Crée ton compte gratuit pour les découvrir — ça ne prend qu'une minute."
- Bouton primaire : "Je crée mon compte gratuit →" → redirige vers `/auth/register`
- Lien secondaire : "Déjà un compte ? Se connecter" → redirige vers `/auth/login`
**Rationale :** Ton chaleureux et encourageant adapté au public cible (16–28 ans, Afrique francophone). Le "je" dans le bouton fait parler l'utilisateur.

### D3 — Suppression complète (pas de feature flag)
**Décision :** Supprimer le code CinetPay entièrement, sans garde-fou ni flag.
**Rationale :** Le code n'a jamais été en production. Un feature flag serait de la complexité inutile pour du code jamais activé.

### D4 — Tables Prisma conservées
**Décision :** `Payment` et `PurchaseAccess` restent en base sans modification.
**Rationale :** Aucune migration = zéro risque. Ces tables seront réutilisées lors de la réintroduction de la monétisation.

### D5 — `X` dans le wording = nombre réel de recommandations
**Décision :** Le `X` dans "On a trouvé X opportunités" est dynamique — il affiche `locked.length + FREE_LIMIT` (total des recommandations matchées).
**Rationale :** Crée de la curiosité concrète et personnalisée plutôt qu'un message générique.

## Risks / Trade-offs

- **Utilisateurs ayant déjà payé** : non applicable — aucun paiement n'a jamais été traité en production.
- **Variables d'env CinetPay** : après suppression du code, les variables `CINETPAY_*` dans `.env.local` peuvent rester (elles ne causent pas d'erreur si inutilisées).
- **Import `PaymentForm` résiduel** : vérifier qu'aucun fichier n'importe `PaymentForm` ou `cinetpay` avant suppression pour éviter des erreurs de build.

## Migration Plan

1. Modifier `results/page.tsx` — logique `hasAccess`
2. Modifier `PaywallSection.tsx` — wording + CTA
3. Supprimer les fichiers CinetPay dans l'ordre (lib → API routes → page → composant)
4. Retirer `/payment` des `PROTECTED_ROUTES` dans `proxy.ts`
5. Vérifier le build TypeScript
