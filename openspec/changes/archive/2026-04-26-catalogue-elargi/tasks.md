## 1. Modèle de données

- [x] 1.1 Ajouter dans `prisma/schema.prisma` : modèle `GuideSubscription`, enum `GuidePlan` (MONTHLY, ANNUAL), enum `GuideSubscriptionStatus` (ACTIVE, CANCELLED, EXPIRED)
- [x] 1.2 Ajouter la relation `guide_subscriptions GuideSubscription[]` sur le modèle `User`
- [x] 1.3 Générer et appliquer la migration Prisma : `npx prisma migrate dev --name add-guide-subscription`
- [x] 1.4 Vérifier avec `npx prisma studio` ou `npx prisma validate` que le schéma est valide

## 2. API d'accès Guide Premium

- [x] 2.1 Créer `src/app/api/user/guide-access/route.ts` (GET) : extraire `user_id` du JWT Supabase, requêter `GuideSubscription` active, retourner `{ hasAccess, plan?, expiresAt? }`
- [x] 2.2 Retourner 401 si non authentifié, 200 avec `{ hasAccess: false }` si aucun abonnement valide

## 3. Composants catalogue

- [x] 3.1 Créer `src/components/features/catalog/CatalogCard.tsx` : card opportunité sans score de matching (badge catégorie, zone, financement, deadline, description, bouton "Voir les détails", SaveButton)
- [x] 3.2 Créer `src/components/features/catalog/CatalogClient.tsx` : Client Component avec filtres pills (catégorie, zone, financement, deadline), recherche textuelle, compteur dynamique, liste de CatalogCard, empty state
- [x] 3.3 Créer `src/components/features/catalog/UpsellGuide.tsx` : aperçu flou (3 cards), liste de bénéfices, tarifs mensuel/annuel (annuel mis en avant), CTA et note "liste d'attente"

## 4. Page catalogue

- [x] 4.1 Créer `src/app/(app)/(public)/catalog/page.tsx` : Server Component qui vérifie la session Supabase, appelle `/api/user/guide-access`, affiche `CatalogClient` (abonné) ou `UpsellGuide` (non-abonné)
- [x] 4.2 Ajouter `/catalog` à `PROTECTED_ROUTES` dans `src/proxy.ts` pour la redirection edge vers `/auth/login?next=/catalog`

## 5. Points d'entrée

- [x] 5.1 Ajouter dans `ResultsClient.tsx` un lien "Voir tout le catalogue →" vers `/catalog` après le bloc CoachingUpsell
- [x] 5.2 Ajouter dans `ProfileClient.tsx` une section "Guide Premium" affichant le statut de l'abonnement (actif / inactif, date d'expiration) via `GET /api/user/guide-access`

## 6. Spec OpenSpec

- [x] 6.1 Créer `openspec/specs/guide-premium-catalog/spec.md` documentant : accès abonnés, règles d'accès, filtres disponibles, UX upsell pour non-abonnés
