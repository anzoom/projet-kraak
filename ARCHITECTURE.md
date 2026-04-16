# Architecture technique — KRAAK
**Version :** 4.0
**Dernière mise à jour :** Avril 2026
**Statut :** Validé — intègre les corrections de la revue d'architecture

---

## 1. Principes directeurs

- **Un seul langage** : TypeScript du schéma de données aux composants UI
- **Mobile-first** : HTML pré-rendu côté serveur, JS client minimal
- **Admin généré depuis le schéma** : Payload CMS, pas de back-office à construire de zéro
- **Lean cost** : tier gratuit jusqu'à la traction, architecture qui scale sans réécriture
- **Séparation des domaines** : CMS/admin d'un côté, logique métier de l'autre

---

## 2. Vue d'ensemble

```
┌────────────────────────────────────────────────────────────────────┐
│                        Vercel (Edge Network)                        │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   Next.js 14 — App Router                    │  │
│  │                                                              │  │
│  │   Routes publiques          Routes protégées                 │  │
│  │   /                         /dashboard          (user)       │  │
│  │   /test                     /results            (user)       │  │
│  │   /auth/**                  /results/[scoreId]  (user+accès) │  │
│  │                             /admin/**            (Payload)   │  │
│  │                                                              │  │
│  │                             API Routes                       │  │
│  │                             /api/scoring                     │  │
│  │                             /api/matching                    │  │
│  │                             /api/payment/initiate            │  │
│  │                             /api/payment/revoke              │  │
│  │                             /api/webhooks/cinetpay           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────┬─────────────────────────┘
                    │                      │
         ┌──────────▼──────────┐  ┌────────▼────────────┐
         │   Supabase          │  │  Services externes   │
         │                     │  │                     │
         │   PostgreSQL        │  │  CinetPay            │
         │   Supabase Auth     │  │  PostHog             │
         │   Storage           │  │  Sentry              │
         │                     │  │  Resend              │
         └─────────────────────┘  │  Upstash             │
                                  └─────────────────────┘
```

---

## 3. Stack technique

### 3.1 Frontend & Application

| Élément | Choix | Version | Rôle |
|---|---|---|---|
| Framework | **Next.js** | 14+ (App Router) | SSR, SSG, API Routes, routing |
| Langage | **TypeScript** | 5.x | Typage strict end-to-end — non négociable |
| Rendu | **Server Components** | React 18 | Réduction JS client, performance mobile |
| Styles | **Tailwind CSS** | 3.x | Utility-first, mobile-first natif |
| Composants UI | **shadcn/ui** | latest | Composants accessibles, non-opinionnés |
| Formulaires | **React Hook Form** + **Zod** | latest | Validation type-safe côté client et serveur |
| État client | **Zustand** | 4.x | État léger pour le parcours questionnaire |

**Pourquoi App Router :** les Server Components réduisent le JavaScript envoyé au navigateur de 40 à 60% — critique pour les réseaux africains. Le Pages Router ne reçoit plus de nouvelles fonctionnalités depuis 2023.

**Pourquoi TypeScript dès le départ :** impossible à ajouter proprement après coup. Protège contre les bugs silencieux en production et rend les refactorisations sûres à mesure que le produit grandit.

---

### 3.2 Back-office admin

| Élément | Choix | Rôle |
|---|---|---|
| Admin panel | **Payload CMS 3.x** | CRUD opportunités, suivi paiements, révocation accès |
| Intégration | Embedded dans Next.js (App Router) | Même déploiement, même base de données |
| ORM admin | **Drizzle** (via Payload) | Gestion automatique du schéma des collections CMS |
| Auth admin | **Payload Auth** | Comptes admin séparés, RBAC natif |

Payload CMS v3 est une bibliothèque TypeScript — pas un service externe. Il génère un panneau admin complet à partir des définitions de collections. Un administrateur peut gérer les opportunités sans toucher au code.

**Collections Payload CMS :**
- `Opportunity` — toutes les métadonnées structurées
- `AdminUser` — comptes back-office avec rôles
- `Page` *(Phase 2)* — contenu marketing éditable

---

### 3.3 Base de données

| Élément | Choix | Détail |
|---|---|---|
| SGBD | **PostgreSQL** | Via Supabase |
| Hébergeur | **Supabase** | Free → Pro selon traction |
| ORM métier | **Prisma** | Entités business : users, tests, paiements, accès |
| ORM admin | **Drizzle** via Payload | Collections CMS uniquement |
| Migrations | Prisma Migrate (métier) + Payload Migrate (CMS) | Deux périmètres indépendants |

**Séparation des domaines :**

```
PostgreSQL (Supabase)
│
├── Tables Payload CMS (Drizzle)
│   ├── opportunities
│   ├── admin_users
│   └── payload_preferences / payload_migrations
│
└── Tables Prisma (logique métier)
    ├── users
    ├── test_responses
    ├── user_profile_scores
    ├── recommendations
    ├── payments
    └── purchase_accesses
```

**Protocole de migration — ordre impératif :**

Les deux ORM opèrent sur la même base. Exécuter toujours dans cet ordre lors d'un déploiement :

```bash
# 1. Migrations Payload (CMS) en premier
npx payload migrate

# 2. Migrations Prisma (métier) ensuite
npx prisma migrate deploy
```

Ne jamais exécuter les deux en parallèle — risque de verrou sur PostgreSQL.

---

### 3.4 Authentification

| Élément | Choix | Rôle |
|---|---|---|
| Auth utilisateurs | **Supabase Auth** | Email/password, sessions JWT |
| Auth administrateurs | **Payload CMS Auth** | Comptes admin séparés, RBAC |
| Sessions | JWT cookie HttpOnly | Inaccessible depuis le JavaScript navigateur |
| Protection routes | Next.js Middleware | Logique de vérification selon la route |

**Séparation stricte des deux systèmes d'auth :**

Les routes `/admin/**` sont entièrement gérées par Payload — son middleware propre vérifie le JWT Payload. Le middleware Next.js n'intervient pas sur ces routes.

Les routes `/dashboard`, `/results`, `/results/[scoreId]` sont protégées par le middleware Next.js qui vérifie le JWT Supabase.

```typescript
// middleware.ts — logique de séparation
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/** → Payload gère lui-même, on ne touche pas
  if (pathname.startsWith('/admin')) return NextResponse.next()

  // Routes protégées user → vérification JWT Supabase
  const protectedRoutes = ['/dashboard', '/results']
  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    // vérifier le cookie JWT Supabase
    // si absent → redirect /auth/login
  }
}
```

---

### 3.5 Parcours utilisateur et gestion du score

**Décision retenue : compte créé après le test, avant le paywall.**

Le test est anonyme. Les réponses sont stockées dans `localStorage` (pas `sessionStorage`) pour survivre aux interruptions mobiles — appel entrant, batterie faible, fermeture d'onglet.

```
1. Utilisateur fait le test → réponses dans localStorage (clé: kraak_anonymous_session)
2. Test terminé → /auth/register ("Crée ton compte pour voir tes résultats")
3. Compte créé → Supabase Auth émet un JWT
4. TestResponse lu depuis localStorage, persisté en base avec user_id
5. localStorage vidé (données sensibles nettoyées)
6. Scoring calculé → UserProfileScore créé → score_id retourné
7. score_id stocké dans un cookie de session sécurisé (HttpOnly)
8. Redirection → /results (aperçu partiel + paywall)
```

**Routing des résultats :**

| Route | Accès requis | Contenu |
|---|---|---|
| `/results` | JWT Supabase valide | Aperçu partiel (2–3 opps) + paywall |
| `/results/[scoreId]` | JWT + PurchaseAccess valide et non expiré | Toutes les recommandations + plan d'action |

```typescript
// Vérification dans /results/[scoreId]/page.tsx
const access = await prisma.purchaseAccess.findFirst({
  where: {
    user_id: currentUserId,
    score_id: params.scoreId,
    expires_at: { gt: new Date() }  // accès non expiré
  }
})
if (!access) redirect('/results')  // retour au paywall
```

---

### 3.6 Moteur de scoring et matching

Fonctions **TypeScript pures**, sans dépendance framework, testées de manière exhaustive.

```
src/domain/
├── scoring/
│   ├── rules.ts          // Règles configurables — modifiables sans toucher au moteur
│   ├── scorer.ts         // TestResponse → UserProfileScore
│   └── scorer.test.ts    // Tests unitaires (Vitest)
└── matching/
    ├── matcher.ts        // UserProfileScore + Opportunities → Recommendation[]
    └── matcher.test.ts
```

Même jeu de réponses → même score, toujours. Chaque règle est traçable.

---

### 3.7 Paiement

| Élément | Choix | Détail |
|---|---|---|
| PSP principal | **CinetPay** | Orange Money, MTN MoMo, Moov, Wave |
| PSP fallback | **Notchpay** | Couverture complémentaire |
| Intégration | Webhook + vérification signature HMAC | Jamais de validation côté client |
| Stockage | `psp_transaction_id` uniquement | Aucune donnée de carte conservée |
| Durée d'accès | **6 mois** | `expires_at = now() + 6 mois` |
| Montants | **Entiers en XOF** (centimes) | Pas de virgule flottante sur les montants financiers |

**Flux paiement :**
```
1. "Payer" → POST /api/payment/initiate
2. Payment(PENDING) créé en base
3. CinetPay API → payment_url retournée
4. Utilisateur paie sur interface CinetPay (Mobile Money)
5. CinetPay → webhook POST /api/webhooks/cinetpay
6. Serveur vérifie signature HMAC
7. Contrôle idempotence : psp_transaction_id déjà traité ? → ignorer
8. Si SUCCESS :
   - Payment(SUCCESS) mis à jour
   - PurchaseAccess créé (expires_at = now() + 6 mois)
   - Email confirmation via Resend
9. Redirection → /results/[scoreId] (accès complet)
```

**Idempotence du webhook :**
```typescript
// /api/webhooks/cinetpay/route.ts
const existing = await prisma.payment.findUnique({
  where: { psp_transaction_id: payload.transaction_id }
})
// Si déjà SUCCESS → retourner 200 sans retraiter
if (existing?.status === 'SUCCESS') {
  return NextResponse.json({ received: true })
}
```

---

### 3.8 Remboursement

CinetPay ne supporte pas le remboursement programmatique sur tous les opérateurs Mobile Money. **Le remboursement CinetPay est traité manuellement** via le tableau de bord CinetPay par l'administrateur.

L'application gère uniquement sa partie : révoquer l'accès et notifier l'utilisateur.

**Flux remboursement :**
```
1. Admin rembourse manuellement via dashboard CinetPay
2. Admin déclenche la révocation depuis /admin (action Payload)
3. POST /api/payment/revoke { paymentId }  (endpoint protégé AdminUser)
4. Transaction atomique :
   - Payment(REFUNDED) mis à jour
   - PurchaseAccess supprimé
5. Email de confirmation envoyé à l'utilisateur via Resend
```

---

### 3.9 Import des opportunités (CSV)

```bash
# Valider sans importer
npx tsx scripts/import-opportunities.ts --file opportunities.csv --dry-run

# Importer
npx tsx scripts/import-opportunities.ts --file opportunities.csv
```

Utilise la Payload Local API. Chaque ligne est validée par le schéma Payload avant insertion. Les lignes invalides sont rejetées dans `import-errors.log`.

**Format CSV :**
```
title, country, category, study_level, domain, funding_type,
budget_required, deadline, competitiveness_level,
eligibility_summary, source_url, short_description
```

---

### 3.10 Hébergement et environnements

| Environnement | Hébergement | Base de données | Usage |
|---|---|---|---|
| **Développement** | Local (`localhost:3000`) | Supabase projet dev | Code quotidien |
| **Staging** | Vercel (branche `staging`) | Supabase projet staging | Validation avant prod, CinetPay sandbox |
| **Production** | Vercel (branche `main`) | Supabase projet prod | Utilisateurs réels |

Chaque environnement a ses propres variables d'environnement — aucun partage de base de données entre staging et production.

**Pipeline CI/CD :**
```
git push (PR)   → GitHub Actions
                    ├── lint + typecheck (tsc --noEmit)
                    ├── tests unitaires Vitest
                    ├── build Next.js
                    └── deploy Vercel preview

git merge main  → GitHub Actions
                    ├── (mêmes vérifications)
                    ├── npx payload migrate    (Payload en premier)
                    ├── npx prisma migrate deploy
                    └── deploy Vercel production
```

---

### 3.11 Tests

| Type | Outil | Cible |
|---|---|---|
| **Unitaires** | **Vitest** | Moteur scoring, moteur matching, fonctions pures |
| **Intégration** | **Vitest** + Supabase staging | API Routes paiement, webhooks |
| **E2E** | **Playwright** | Parcours complet : test → inscription → paiement → résultats |

Les tests E2E s'exécutent contre l'environnement staging avec CinetPay en mode sandbox.

---

### 3.12 Observabilité

| Outil | Usage | Tier gratuit |
|---|---|---|
| **PostHog** | Analytics produit, funnel (source de vérité analytics) | 1M events/mois |
| **Sentry** | Error tracking, performance | 5K errors/mois |
| **Resend** | Emails transactionnels | 3K emails/mois |
| **Upstash** | Rate limiting (auth + paiement) | 10K requêtes/jour |
| **Vercel Analytics** | Core Web Vitals mobile | Inclus Pro |

PostHog est la **seule** source de vérité pour les analytics. Pas de table `AnalyticsEvent` en base — cela évite une duplication sans valeur ajoutée.

**Events PostHog instrumentés :**
```
landing_page_viewed
test_started
test_step_completed        { step: number }
test_completed
account_created
results_preview_viewed
paywall_displayed
payment_initiated          { psp: "cinetpay" | "notchpay" }
payment_succeeded
payment_failed             { reason: string }
full_results_viewed
access_expired             { days_since_purchase: number }
refund_issued
dashboard_accessed
```

---

## 4. Schéma de données (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  supabase_uid  String    @unique
  deleted_at    DateTime?           // soft delete — null = actif
  created_at    DateTime  @default(now())

  test_responses    TestResponse[]
  purchase_accesses PurchaseAccess[]
  payments          Payment[]
}

model TestResponse {
  id          String   @id @default(cuid())
  user_id     String
  answers     Json
  completed   Boolean  @default(false)
  created_at  DateTime @default(now())

  user          User              @relation(fields: [user_id], references: [id])
  profile_score UserProfileScore?
}

model UserProfileScore {
  id               String   @id @default(cuid())
  test_response_id String   @unique
  academic_score   Int
  financial_score  Int
  maturity_score   Int
  segment          String
  computed_at      DateTime @default(now())

  test_response     TestResponse     @relation(fields: [test_response_id], references: [id])
  recommendations   Recommendation[]
  purchase_accesses PurchaseAccess[]
}

model Recommendation {
  id             String @id @default(cuid())
  score_id       String
  opportunity_id String   // référence vers table Payload CMS
  match_score    Float
  justification  String

  profile_score  UserProfileScore @relation(fields: [score_id], references: [id])
}

model Payment {
  id                 String        @id @default(cuid())
  user_id            String
  amount             Int           // en XOF entier — jamais Float pour des montants
  currency           String        @default("XOF")
  psp                String        // "cinetpay" | "notchpay"
  psp_transaction_id String?       @unique
  status             PaymentStatus @default(PENDING)
  created_at         DateTime      @default(now())
  updated_at         DateTime      @updatedAt

  user            User            @relation(fields: [user_id], references: [id])
  purchase_access PurchaseAccess?
}

model PurchaseAccess {
  id         String   @id @default(cuid())
  user_id    String
  payment_id String   @unique
  score_id   String
  expires_at DateTime  // now() + 6 mois — jamais null
  created_at DateTime @default(now())

  user          User             @relation(fields: [user_id], references: [id])
  payment       Payment          @relation(fields: [payment_id], references: [id])
  profile_score UserProfileScore @relation(fields: [score_id], references: [id])
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}
```

---

## 5. Structure du projet

```
kraak/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # Landing page
│   │   │   ├── test/page.tsx               # Questionnaire (anonyme)
│   │   │   └── auth/
│   │   │       ├── register/page.tsx       # Création compte (post-test)
│   │   │       ├── login/page.tsx
│   │   │       └── reset/page.tsx
│   │   ├── (protected)/                    # Middleware vérifie JWT Supabase
│   │   │   ├── results/page.tsx            # Résultats partiels + paywall
│   │   │   ├── results/[scoreId]/page.tsx  # Résultats complets (vérifie PurchaseAccess)
│   │   │   └── dashboard/page.tsx
│   │   ├── (payload)/                      # Payload gère son propre middleware
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/
│   │       ├── scoring/route.ts
│   │       ├── matching/route.ts
│   │       ├── payment/
│   │       │   ├── initiate/route.ts
│   │       │   ├── revoke/route.ts         # Révocation accès (admin uniquement)
│   │       │   └── webhooks/
│   │       │       └── cinetpay/route.ts   # Idempotence intégrée
│   │       └── [...payload]/route.ts
│   │
│   ├── domain/
│   │   ├── scoring/
│   │   │   ├── rules.ts
│   │   │   ├── scorer.ts
│   │   │   └── scorer.test.ts
│   │   └── matching/
│   │       ├── matcher.ts
│   │       └── matcher.test.ts
│   │
│   ├── collections/
│   │   ├── Opportunities.ts
│   │   ├── AdminUsers.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── supabase/         # Clients Supabase (server + browser)
│   │   ├── prisma/           # Singleton Prisma client
│   │   ├── cinetpay/         # Wrapper CinetPay (initiate, verify HMAC)
│   │   ├── upstash/          # Rate limiting
│   │   └── posthog/          # Analytics (server + client)
│   │
│   ├── middleware.ts          # Séparation JWT Supabase / Payload
│   │
│   └── components/
│       ├── ui/               # shadcn/ui
│       └── features/
│           ├── test/
│           ├── results/
│           └── paywall/
│
├── scripts/
│   └── import-opportunities.ts
│
├── prisma/
│   └── schema.prisma
│
├── e2e/                       # Tests Playwright
│   └── user-journey.spec.ts
│
├── payload.config.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Variables d'environnement

À créer dans `.env.local` (développement) et dans les variables Vercel (staging + production).

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # côté serveur uniquement — jamais exposé au client

# Payload CMS
PAYLOAD_SECRET=                   # chaîne aléatoire longue pour signer les sessions admin

# Base de données (Prisma)
DATABASE_URL=                     # URL PostgreSQL Supabase (avec pooler pour production)

# CinetPay
CINETPAY_API_KEY=
CINETPAY_SITE_ID=
CINETPAY_WEBHOOK_SECRET=          # pour vérifier la signature HMAC des webhooks

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Resend
RESEND_API_KEY=

# Environnement
NODE_ENV=                         # development | staging | production
```

> Aucune de ces variables ne doit apparaître dans le dépôt Git. Le fichier `.env.local` est dans `.gitignore`.

---

## 7. Sécurité

| Menace | Contre-mesure |
|---|---|
| XSS | CSP headers Next.js + échappement React natif |
| CSRF | Cookies `SameSite=Strict` + tokens sur mutations |
| Injection SQL | Prisma (requêtes paramétrées) + Drizzle (Payload) |
| Brute force | Rate limiting Upstash sur `/auth/**` et `/api/payment/**` |
| Secrets exposés | Variables d'env Vercel — jamais dans le bundle client |
| Confusion auth Payload/Supabase | Middleware séparé selon la route (voir section 3.4) |
| Webhook spoofing | Vérification signature HMAC CinetPay côté serveur |
| Double traitement webhook | Contrôle idempotence sur `psp_transaction_id` |
| IDOR | `user_id` extrait du JWT serveur, jamais du body de la requête |
| Accès expiré | `expires_at > now()` vérifié côté serveur à chaque accès à `/results/[scoreId]` |
| Révocation frauduleuse | `/api/payment/revoke` réservé aux `AdminUser` Payload (token vérifié) |
| Arrondi monétaire | Montants stockés en `Int` XOF entier — pas de `Float` |
| Suppression données (RGPD) | Soft delete `User.deleted_at` + anonymisation email |

---

## 8. Coûts estimés

| Service | Tier gratuit | Tier payant |
|---|---|---|
| Vercel | 100 GB bande passante | Pro : 20$/mois |
| Supabase | 500 MB DB, 50K users actifs/mois | Pro : 25$/mois (×3 environnements) |
| PostHog | 1M events/mois | Scale : selon volume |
| Sentry | 5K errors/mois | Team : 26$/mois |
| Resend | 3K emails/mois | Pro : 20$/mois |
| Upstash | 10K requêtes/jour | Pay-as-you-go |
| CinetPay | — | ~2–3% par transaction |
| **Total MVP** | **~0 $/mois** | **< 100 $/mois si traction** |

---

## 9. Ordre de construction

Les étapes 2 et 3 (questionnaire + auth) sont fusionnées car indissociables : le questionnaire se termine par une redirection vers l'inscription.

```
Étape 1 — Fondations (semaine 1)
  ├── Créer le projet Next.js + TypeScript + Tailwind
  ├── Configurer Supabase (3 projets : dev, staging, prod)
  ├── Configurer Prisma + créer les tables
  ├── Intégrer Payload CMS
  ├── Configurer le middleware d'auth
  └── Déployer sur Vercel (CI/CD dès le départ)

Étape 2 — Parcours utilisateur core (semaines 2–4)
  ├── Moteur de scoring (fonctions TypeScript + tests Vitest)
  ├── Moteur de matching
  ├── Questionnaire (stockage localStorage)
  ├── Inscription / connexion (Supabase Auth)
  ├── Rattachement TestResponse → User + scoring au submit
  └── /results (aperçu partiel + paywall)

Étape 3 — Monétisation (semaines 5–6)
  ├── Intégration CinetPay (sandbox CinetPay + staging Supabase)
  ├── Webhook + idempotence
  ├── PurchaseAccess + vérification expiration
  └── /results/[scoreId] (accès complet)

Étape 4 — Expérience complète (semaine 7)
  ├── Dashboard utilisateur
  ├── Emails transactionnels (Resend)
  └── Révocation accès (admin Payload)

Étape 5 — Lancement (semaine 8)
  ├── Landing page
  ├── Import opportunités CSV
  ├── Tests E2E Playwright sur staging
  ├── PostHog + Sentry en production
  └── Bascule CinetPay sandbox → production
```

---

## 10. Décisions architecturales (ADR)

| Décision | Justification |
|---|---|
| Next.js App Router | Pages Router : impasse long-terme, plus de nouvelles fonctionnalités depuis 2023 |
| TypeScript strict dès le départ | Impossible à ajouter proprement après coup |
| Payload CMS intégré | Admin complet, même DB, même déploiement |
| Prisma pour les entités métier | Type-safety, migrations versionnées, requêtes lisibles |
| PostgreSQL | Modèle de données fortement relationnel |
| Supabase Auth pour les users | Auth complète sans code côté app |
| Middleware séparé Payload/Supabase | Évite toute confusion entre les deux systèmes JWT |
| localStorage (pas sessionStorage) | Survit aux interruptions mobiles fréquentes en Afrique |
| score_id via cookie HttpOnly | Transmission sécurisée entre scoring et page résultats |
| Idempotence webhook obligatoire | CinetPay peut rejouer un webhook — un seul traitement autorisé |
| Montants en Int XOF | Float interdit sur les montants financiers (arrondi) |
| Remboursement CinetPay manuel | CinetPay ne supporte pas le remboursement API sur tous les opérateurs |
| PostHog seule source analytics | Évite la duplication avec une table AnalyticsEvent en base |
| Soft delete sur User | Intégrité référentielle préservée lors d'une suppression RGPD |
| Vitest + Playwright | Standards Next.js pour les tests unitaires et E2E |
| 3 environnements (dev/staging/prod) | Requis par le PRD — staging avec CinetPay sandbox |
| Migration Payload avant Prisma | Protocole obligatoire — évite les conflits de verrous PostgreSQL |
