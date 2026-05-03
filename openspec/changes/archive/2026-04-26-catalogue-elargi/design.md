## Architecture

### Modèle Prisma — GuideSubscription

```prisma
model GuideSubscription {
  id                  String                  @id @default(cuid())
  user_id             String
  plan                GuidePlan               // MONTHLY | ANNUAL
  status              GuideSubscriptionStatus @default(ACTIVE)
  current_period_end  DateTime                // date d'expiration de la période en cours
  lemon_order_id      String?                 // référence Lemon Squeezy (Phase 2)
  created_at          DateTime                @default(now())
  updated_at          DateTime                @updatedAt

  user User @relation(fields: [user_id], references: [id])

  @@index([user_id])
}

enum GuidePlan {
  MONTHLY
  ANNUAL
}

enum GuideSubscriptionStatus {
  ACTIVE
  CANCELLED   // résilié mais accès maintenu jusqu'à current_period_end
  EXPIRED     // current_period_end dépassée
}
```

**Règle d'accès :** `status = ACTIVE && current_period_end > now()` OU `status = CANCELLED && current_period_end > now()`.

---

### API — GET /api/user/guide-access

```
GET /api/user/guide-access
Authorization: Supabase JWT (cookie HttpOnly)

Réponse 200 (authentifié) :
  { hasAccess: boolean, plan?: "MONTHLY" | "ANNUAL", expiresAt?: string }

Réponse 401 : { error: "Non authentifié" }
```

Logique :
1. Extraire `user_id` du JWT Supabase.
2. `prisma.guideSubscription.findFirst({ where: { user_id, status: { in: ["ACTIVE", "CANCELLED"] }, current_period_end: { gt: new Date() } }, orderBy: { created_at: "desc" } })`
3. Si trouvé → `hasAccess: true` + `plan` + `expiresAt`.
4. Sinon → `hasAccess: false`.

---

### Page /catalog — Server Component

```
src/app/(app)/(public)/catalog/page.tsx

1. Vérification session Supabase (createSupabaseServerAnonClient)
2. Si non authentifié → redirect("/auth/login?next=/catalog")
3. Appel interne : GET /api/user/guide-access via server-side fetch
4. Si hasAccess = false → afficher <UpsellGuide />
5. Si hasAccess = true → fetch toutes les opportunités (fetchOpportunities())
   → afficher <CatalogClient opportunities={...} />
```

La page est publique (`(public)`) mais protège le contenu via la logique de rendu côté serveur (pas via le middleware).

---

### CatalogClient — filtres et liste

```
src/components/features/catalog/CatalogClient.tsx

État local :
  - filterCategory: string | "tous"
  - filterZone: string | "tous"
  - filterFunding: string | "tous"
  - filterDeadline: "all" | "soon" | "no_deadline"
  - searchQuery: string (recherche textuelle sur title)

Filtrage (côté client, sur les données pré-chargées) :
  - category !== "tous" → opp.category === filterCategory
  - zone !== "tous" → opp.country === filterZone
  - funding !== "tous" → opp.funding_type === filterFunding
  - deadline "soon" → deadline ≤ 90 jours ET non expiré
  - deadline "no_deadline" → deadline = null
  - searchQuery → opp.title.toLowerCase().includes(query)

Affichage :
  - Barre de filtres horizontale (pills scrollables sur mobile)
  - Compteur "X opportunités" mis à jour dynamiquement
  - Liste de <CatalogCard /> scrollable
  - Empty state si aucun résultat après filtrage
```

---

### CatalogCard

```
src/components/features/catalog/CatalogCard.tsx

Similaire à RecommendationCard mais sans score de matching :
  - Badge catégorie + zone
  - Titre
  - Type de financement + deadline (avec badge "⏰ Bientôt" si < 30j)
  - Description courte (2 lignes max)
  - Bouton "Voir les détails" → ouvre OpportunityDetailModal
  - SaveButton (cœur)

Pas de "Pourquoi ce match" — c'est la navigation libre, pas le matching.
```

---

### UpsellGuide — non-abonnés

```
src/components/features/catalog/UpsellGuide.tsx

Affiché à la place du catalogue si hasAccess = false.

Structure :
  - En-tête : "📚 Catalogue complet — KRAAK Premium Guide"
  - Aperçu : 3 cards opportunités floutées (blur-sm + overlay)
  - Message : "X opportunités actives accessibles aux abonnés"
  - Liste des bénéfices (guide interactif, alertes, newsletter)
  - Tarifs : mensuel 2 500 XOF / annuel 19 900 XOF (mis en avant)
  - CTA : "Accéder au Guide Premium →" → /guide-premium (page dédiée Phase 2)
  - Note : "Paiement bientôt disponible — rejoins la liste d'attente"
     → lien mailto ou formulaire simple
```

---

### Lien d'entrée — ResultsClient

Ajouter dans `ResultsClient.tsx`, après le bloc CoachingUpsell :

```tsx
<div className="text-center pt-4">
  <Link href="/catalog" className="text-sm text-primary font-semibold hover:underline">
    Voir tout le catalogue ({count} opportunités) →
  </Link>
</div>
```

`count` = nombre total d'opportunités passé en prop depuis la page serveur.

---

### Middleware — route /catalog

Ajouter `/catalog` à la liste des routes protégées dans `src/proxy.ts` pour rediriger les utilisateurs non authentifiés avant le rendu serveur.

```typescript
// src/proxy.ts
const PROTECTED_ROUTES = ["/dashboard", "/results", "/catalog"]
```

---

### Dashboard — statut abonnement

Dans `ProfileClient.tsx`, après la section "Mon compte", ajouter un bloc conditionnel affichant le statut de l'abonnement Guide Premium (actif / expiré) et la date d'expiration, lu via `GET /api/user/guide-access`.
