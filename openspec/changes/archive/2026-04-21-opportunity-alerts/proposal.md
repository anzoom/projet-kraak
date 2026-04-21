## Why

Un utilisateur inscrit qui visite KRAAK une fois et repart n'a aucune raison de revenir — sauf si quelque chose le rappelle. Les alertes email sont le mécanisme de rétention le plus direct : "Une nouvelle opportunité correspond à ton profil."

Le catalog KRAAK est mis à jour régulièrement (nouvelles bourses, nouvelles formations). Sans notification, les opportunités récentes ne sont jamais vues par les utilisateurs qui ont déjà fait leur test.

## What Changes

1. **Persistance des réponses** : quand un utilisateur authentifié visite `/results`, ses réponses du localStorage sont enregistrées en base dans la table Prisma `TestResponse` (idempotent — une seule fois par session)
2. **Abonnement aux alertes** : un toggle "Recevoir les alertes email" dans la page `/dashboard` (ProfileClient) — appelle `/api/user/alerts` pour basculer `alerts_enabled` sur le modèle `User` Prisma
3. **Migration Prisma** : ajout du champ `alerts_enabled Boolean @default(false)` sur le modèle `User`
4. **Endpoint cron** : `/api/cron/send-alerts` (protégé par `CRON_SECRET`) — pour chaque utilisateur abonné, charge ses dernières réponses, lance le matching, envoie un email Resend avec les 3 meilleures opportunités
5. **Template email** : email HTML simple "Nouvelles opportunités pour ton profil" avec 3 cards d'opportunités et un CTA "Voir toutes mes recommandations"

## Capabilities

### New Capabilities
- `opportunity-alerts` : alertes email hebdomadaires basées sur le profil de l'utilisateur
- `test-response-persistence` : sauvegarde des réponses du test en base quand l'utilisateur est authentifié

### Modified Capabilities
- `user-profile` : toggle d'abonnement aux alertes dans `/dashboard`

## Impact

- Migration Prisma : `alerts_enabled` sur `User`
- Nouveau : `src/app/api/user/alerts/route.ts` (toggle abonnement)
- Nouveau : `src/app/api/user/save-test-response/route.ts` (persistance des réponses)
- Nouveau : `src/app/api/cron/send-alerts/route.ts` (envoi email)
- Modification : `src/components/features/results/ResultsClient.tsx` — déclenche la sauvegarde des réponses si authentifié
- Modification : `src/components/features/profile/ProfileClient.tsx` — toggle alertes
