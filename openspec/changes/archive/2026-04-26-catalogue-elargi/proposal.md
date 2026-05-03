## Why

Les utilisateurs KRAAK reçoivent 5 recommandations gratuites parfaitement adaptées à leur profil. C'est suffisant pour identifier les meilleures pistes, mais insuffisant pour :
- explorer l'ensemble du catalogue selon des critères personnels (zone, catégorie, deadline) ;
- découvrir des opportunités que le matching automatique n'aurait pas prioritairement remontées ;
- suivre les deadlines et les nouvelles entrées sur la durée.

Le **catalogue élargi** est la fonctionnalité cœur du KRAAK Premium Guide (Phase 2 du PRD) : un accès libre à l'intégralité des 149+ opportunités actives, avec filtres avancés, réservé aux abonnés.

Ce change couvre :
1. Le **modèle d'abonnement** (`GuideSubscription`) dans Prisma — sans le paiement (change dédié).
2. La **page catalogue** `/catalog` avec filtres et liste paginée.
3. La **gate d'accès** : vérification de l'abonnement actif côté serveur.
4. Le **bloc upsell** affiché aux non-abonnés (aperçu + invitation à souscrire).
5. Le **point d'entrée** depuis la page résultats (lien "Voir tout le catalogue").

Le tunnel de paiement (Lemon Squeezy + Notchpay) fera l'objet d'un change séparé (`guide-premium-payment`). En attendant, les abonnements peuvent être activés manuellement en base pour les beta testeurs.

## What Changes

- **Prisma** : ajout du modèle `GuideSubscription` avec les champs `user_id`, `plan` (monthly/annual), `status` (ACTIVE/CANCELLED/EXPIRED), `current_period_end`.
- **API** : `GET /api/user/guide-access` — retourne `{ hasAccess: boolean, plan?, expiresAt? }`.
- **Page `/catalog`** : Server Component qui vérifie l'accès, affiche le catalogue ou le bloc upsell.
- **CatalogClient** : Client Component avec filtres (catégorie, zone, type de financement, deadline), liste scrollable, cards opportunités.
- **UpsellGuide** : Composant affiché aux non-abonnés avec aperçu flou de 3 opportunités + CTA souscription.
- **Lien d'entrée** dans `ResultsClient` : "Voir tout le catalogue →" visible après les 5 résultats.

## Capabilities

### New Capabilities
- `guide-premium-catalog` : catalogue élargi filtrable, accès réservé aux abonnés

### Modified Capabilities
- `free-results-access` : ajout du lien d'entrée vers le catalogue depuis la page résultats
- `user-dashboard` : affichage du statut d'abonnement Guide Premium

## Impact

- `prisma/schema.prisma` : modèle `GuideSubscription` + enum `GuideSubscriptionStatus` + `GuidePlan`
- `src/app/api/user/guide-access/route.ts` : nouvel endpoint
- `src/app/(app)/(public)/catalog/page.tsx` : nouvelle page (Server Component)
- `src/components/features/catalog/CatalogClient.tsx` : nouveau composant client (filtres + liste)
- `src/components/features/catalog/CatalogCard.tsx` : card opportunité du catalogue
- `src/components/features/catalog/UpsellGuide.tsx` : bloc upsell pour non-abonnés
- `src/components/features/results/ResultsClient.tsx` : ajout du lien vers le catalogue
- `src/components/features/profile/ProfileClient.tsx` : affichage statut abonnement
