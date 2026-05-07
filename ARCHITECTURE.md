# Architecture technique — KRAAK
**Version :** 5.2
**Dernière mise à jour :** Avril 2026
**Statut :** Validé — paiement MVP via Chariow (pre-checkout token), alertes deadlines 90/30/7j, pages légales, CinetPay natif prévu Phase 3

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
│  │                             /api/coaching/slots              │  │
│  │                             /api/coaching/book               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────┬─────────────────────────┘
                    │                      │
         ┌──────────▼──────────┐  ┌────────▼────────────┐
         │   Supabase          │  │  Services externes   │
         │                     │  │                     │
         │   PostgreSQL        │  │  Chariow (paiement)  │
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

**Décision retenue : compte créé après le test, accès aux résultats entièrement gratuit.**

Le test est anonyme. Les réponses sont stockées dans `localStorage` (pas `sessionStorage`) pour survivre aux interruptions mobiles — appel entrant, batterie faible, fermeture d'onglet.

```
1. Utilisateur fait le test → réponses dans localStorage (clé: kraak_anonymous_session)
2. Test terminé → /auth/register ("Crée ton compte pour voir tes résultats")
3. Compte créé → Supabase Auth émet un JWT
4. TestResponse lu depuis localStorage, persisté en base avec user_id
5. localStorage vidé (données sensibles nettoyées)
6. Scoring calculé → UserProfileScore créé → score_id retourné
7. Redirection → /results (5 opportunités complètes + bloc coaching upsell)
```

**Routing des résultats (MVP — accès gratuit) :**

| Route | Accès requis | Contenu |
|---|---|---|
| `/results` | JWT Supabase valide | 5 recommandations complètes + badges + justification + bloc coaching |

> Le paywall et la route `/results/[scoreId]` sont supprimés du MVP. L'accès aux résultats complets est gratuit pour tous les utilisateurs authentifiés. La monétisation repose sur le coaching premium (Phase 3).

---

### 3.6 Moteur de scoring et matching

Fonctions **TypeScript pures**, sans dépendance framework, testées de manière exhaustive (57 tests unitaires).

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

**Filtres de matching (ordre d'application) :**
1. `is_active = true`
2. `deadline` non expirée (null = toujours valide)
3. `study_level` compatible avec `academic_level` utilisateur
4. `category` === `main_objective` utilisateur (insensible à la casse)
5. `domain` === domaine utilisateur — **exception : `multidisciplinaire` passe toujours**
6. `country` === zone cible utilisateur (`peu_importe` → aucun filtre)
7. `budget_required` ≤ plafond utilisateur (petit=500 000 XOF, moyen=2 000 000 XOF)
8. `deadline` compatible avec `timeline` (urgent ≤ 90 j, court ≤ 180 j, moyen ≤ 365 j)

**Scoring de pertinence (total max = 100) :**
- +30 catégorie (toujours si filtre passé)
- +25 domaine (si domaine renseigné)
- +20 zone géographique (si zone spécifique, pas `peu_importe`)
- +15 financement complet (`funding_type = complete`) si budget utilisateur = zéro
- +10 deadline dans les 90 prochains jours

---

### 3.7 Paiement

#### Phase 2 — Chariow (pre-checkout token)

> Approche retenue pour le MVP : pages produit hébergées sur Chariow, avec pré-génération d'un token côté KRAAK pour activer automatiquement l'abonnement au retour.

| Élément | Choix | Détail |
|---|---|---|
| Plateforme | **Chariow** | Pages produit hébergées |
| Initiation | `POST /api/checkout/initiate` | Crée `CheckoutSession` (token UUID, TTL 1h), construit l'URL Chariow avec `?success_url=` |
| Retour paiement | `GET /guide/success?token=` | Page Next.js SSR — appelle verify, affiche état succès/erreur |
| Activation | `GET /api/checkout/verify?token=` | Valide le token, crée `GuideSubscription` en transaction atomique, envoie email Resend |
| Webhook (stub) | `POST /api/webhooks/chariow` | Validation HMAC prête, inactive — activé en Phase 3 |
| Variables | `NEXT_PUBLIC_CHARIOW_*_URL` dans `.env.local` + Vercel | 4 URLs à renseigner depuis le dashboard Chariow |

**Flux de réconciliation :**
```
1. User clique "Souscrire"
   → POST /api/checkout/initiate
   → CheckoutSession créé { token, user_id, plan, expires_at: +1h }
   → Redirection vers Chariow?success_url=kraak.co/guide/success?token=xxx

2. User paie sur Chariow
   → Chariow redirige vers kraak.co/guide/success?token=xxx

3. Page /guide/success (SSR)
   → GET /api/checkout/verify?token=xxx
   → CheckoutSession validé (PENDING → COMPLETED)
   → GuideSubscription créé (transaction atomique)
   → Email bienvenue (Resend)
   → Redirect /guide (accès immédiat)

Fallback : si token expiré mais user encore authentifié
   → réconciliation par user_id (CheckoutSession PENDING le plus récent)
```

**Produits Chariow à créer :**
- Guide KRAAK — Plan mensuel (2 500 XOF/mois) → `NEXT_PUBLIC_CHARIOW_GUIDE_MONTHLY_URL`
- Guide KRAAK — Plan annuel (19 900 XOF/an) → `NEXT_PUBLIC_CHARIOW_GUIDE_ANNUAL_URL`
- Coaching — Audit de dossier (15 000 XOF) → `NEXT_PUBLIC_CHARIOW_COACHING_AUDIT_URL`
- Coaching — Accompagnement complet (50 000 XOF) → `NEXT_PUBLIC_CHARIOW_COACHING_ACCOMPAGNEMENT_URL`

#### Phase 3 — CinetPay / Notchpay (intégration native, si volumes le justifient)

| Élément | Choix | Détail |
|---|---|---|
| PSP principal | **CinetPay** | Orange Money, MTN MoMo, Moov, Wave |
| PSP fallback | **Notchpay** | Couverture complémentaire |
| Intégration | Webhook + vérification signature HMAC | Jamais de validation côté client |
| Montants | **Entiers en XOF** | Pas de virgule flottante sur les montants financiers |

---

### 3.8 Import des opportunités (CSV)

Le script d'import est un module Node.js (`scripts/import-opportunities.js`) qui se connecte directement à PostgreSQL via le client `pg`.

**Format CSV attendu :**
```
title, country, category, study_level, domain, funding_type,
budget_required, deadline, competitiveness_level,
eligibility_summary, source_url, short_description
```

**Valeurs acceptées par champ :**

| Champ | Valeurs |
|---|---|
| `country` | `afrique`, `europe`, `amerique_nord`, `asie`, `amerique_sud`, `moyen_orient`, `oceanie`, `international` |
| `category` | `bourse`, `programme`, `fellowship`, `concours`, `prix`, `autre` |
| `study_level` | `bac`, `bac2`, `bac3`, `bac5`, `doctorat`, `tous` |
| `funding_type` | `complete`, `partial`, `non_financee`, `salariee` |

Le script normalise automatiquement les variantes courantes (encodage, casse, accents) et déduplique par slug de titre. Les lignes invalides sont ignorées avec log dans la console.

**État actuel du catalogue (2026-04-28) :** 149 opportunités actives.

---

### 3.10 Hébergement et environnements

| Environnement | Hébergement | Base de données | Usage |
|---|---|---|---|
| **Développement** | Local (`localhost:3000`) | Supabase projet dev | Code quotidien |
| **Staging** | Vercel (branche `staging`) | Supabase projet staging | Validation avant prod, URLs Chariow staging |
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
results_viewed
opportunity_clicked        { opportunity_id, opportunity_title, badge }
opportunity_link_opened    { opportunity_id, source_url }
coaching_cta_clicked       { cta_label: string }
coaching_checkout_started  { offer: "audit" | "accompagnement" }
guide_cta_clicked          { source: string }
dashboard_accessed
```

---

## 4. Schéma de données (Prisma)

> Schéma complet Phase 2. Les modèles `Payment` et `PurchaseAccess` sont réservés à la Phase 3 (CinetPay natif).

### Tables Prisma (logique métier)

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  supabase_uid   String    @unique
  alerts_enabled Boolean   @default(false)
  welcome_sent   Boolean   @default(false)
  deleted_at     DateTime?
  created_at     DateTime  @default(now())

  test_responses             TestResponse[]
  purchase_accesses          PurchaseAccess[]
  payments                   Payment[]
  guide_subscriptions        GuideSubscription[]
  saved_opportunities        SavedOpportunity[]
  deadline_alert_preferences DeadlineAlertPreference[]
  checkout_sessions          CheckoutSession[]
}

model GuideSubscription {
  id                 String                  @id @default(cuid())
  user_id            String
  plan               GuidePlan               // MONTHLY | ANNUAL
  status             GuideSubscriptionStatus @default(ACTIVE)
  current_period_end DateTime
  lemon_order_id     String?                 // référence Chariow order
  created_at         DateTime                @default(now())
  updated_at         DateTime                @updatedAt
}

model CheckoutSession {
  id         String         @id @default(cuid())
  user_id    String
  plan       GuidePlan
  token      String         @unique @default(uuid())
  status     CheckoutStatus @default(PENDING)  // PENDING | COMPLETED | EXPIRED
  expires_at DateTime       // now() + 1h
  created_at DateTime       @default(now())
}

model SavedOpportunity {
  id             String   @id @default(cuid())
  user_id        String
  opportunity_id String   // ID Payload CMS — pas de FK (ORM séparé)
  saved_at       DateTime @default(now())

  deadline_alert_preference DeadlineAlertPreference?
}

model DeadlineAlertPreference {
  id             String   @id @default(cuid())
  user_id        String
  opportunity_id String
  alert_90d      Boolean  @default(true)
  alert_30d      Boolean  @default(true)
  alert_7d       Boolean  @default(true)
  saved_opp_id   String   @unique

  sent_alerts    SentDeadlineAlert[]

  @@unique([user_id, opportunity_id])
}

model SentDeadlineAlert {
  id          String   @id @default(cuid())
  pref_id     String
  days_before Int      // 90, 30 ou 7
  sent_at     DateTime @default(now())

  @@unique([pref_id, days_before])  // idempotence — une alerte par fenêtre
}
```

### Tables Payload CMS (Drizzle — gérées automatiquement)
- `opportunities` — catalogue complet (149+ enregistrements au 2026-04-28)
- `admin_users` — comptes back-office
- `payload_preferences`, `payload_migrations` — internes Payload

### Chronologie des migrations

| Migration | Date | Contenu |
|---|---|---|
| `20260421000001_add_coaching_bookings` | 2026-04-21 | `CoachingBooking` |
| `20260426000000_add_guide_subscription` | 2026-04-26 | `GuideSubscription`, enums `GuidePlan`/`GuideSubscriptionStatus` |
| `20260426100000_add_waitlist_entry` | 2026-04-26 | `WaitlistEntry` |
| `20260426110000_add_welcome_sent` | 2026-04-26 | `User.welcome_sent` |
| `20260426120000_add_saved_opportunities` | 2026-04-26 | `SavedOpportunity` |
| `20260428000000_add_checkout_deadline_alerts` | 2026-04-28 | `CheckoutSession`, `DeadlineAlertPreference`, `SentDeadlineAlert` |

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
│   │   │       ├── register/page.tsx
│   │   │       └── login/page.tsx
│   │   │   ├── coaching/page.tsx            # Offres coaching + liens Chariow
│   │   │   ├── guide/
│   │   │   │   ├── page.tsx                # Guide Premium (modules + gate accès)
│   │   │   │   └── success/page.tsx         # Retour post-paiement Chariow ✅
│   │   │   ├── guide-premium/page.tsx       # Page de présentation + tunnel souscription
│   │   │   ├── results/page.tsx
│   │   │   ├── catalog/page.tsx             # Catalogue élargi (abonnés)
│   │   │   ├── confidentialite/page.tsx     # Politique de confidentialité ✅
│   │   │   ├── conditions/page.tsx          # CGU ✅
│   │   │   └── contact/page.tsx             # Page contact ✅
│   │   ├── (protected)/                    # Middleware vérifie JWT Supabase
│   │   │   ├── results/page.tsx            # 5 recommandations + coaching upsell
│   │   │   └── dashboard/page.tsx
│   │   ├── (payload)/                      # Payload gère son propre middleware
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/
│   │       ├── scoring/route.ts
│   │       ├── matching/route.ts
│   │       ├── countries/route.ts
│   │       ├── checkout/
│   │       │   ├── initiate/route.ts       # POST — CheckoutSession + URL Chariow ✅
│   │       │   └── verify/route.ts         # GET — active GuideSubscription ✅
│   │       ├── user/
│   │       │   ├── alerts/route.ts
│   │       │   ├── guide-access/route.ts
│   │       │   └── saved/route.ts
│   │       ├── cron/
│   │       │   ├── send-alerts/route.ts    # Alertes profil hebdo (lundi 8h)
│   │       │   └── deadline-alerts/route.ts # Deadlines 90/30/7j (quotidien 7h) ✅
│   │       ├── webhooks/
│   │       │   └── chariow/route.ts        # Stub Phase 3 — HMAC prête ✅
│   │       └── [...slug]/route.ts          # API Payload CMS
│   │
│   ├── domain/
│   │   ├── scoring/
│   │   │   ├── rules.ts
│   │   │   ├── scorer.ts
│   │   │   └── scorer.test.ts
│   │   └── matching/
│   │       ├── matcher.ts
│   │       └── matcher.test.ts             # 57 tests unitaires
│   │
│   ├── collections/
│   │   ├── Opportunities.ts
│   │   ├── AdminUsers.ts
│   │   └── index.ts
│   │
│   ├── data/
│   │   ├── questions.ts
│   │   └── seed-opportunities.ts
│   │
│   ├── lib/
│   │   ├── supabase/         # Clients Supabase (server + browser)
│   │   ├── prisma/           # Singleton Prisma client
│   │   ├── guide.ts          # hasGuideAccess() + extractPreview()
│   │   ├── opportunities.ts  # fetchOpportunities() + normalisation
│   │   ├── upstash/          # Rate limiting
│   │   └── posthog/          # Analytics
│   │
│   ├── middleware.ts
│   │
│   └── components/
│       ├── ui/               # shadcn/ui
│       └── features/
│           ├── landing/      # Navbar, Footer, CtaSection
│           ├── auth/         # RegisterForm
│           ├── profile/      # ProfileClient
│           ├── results/      # RecommendationCard, OpportunityDetailModal…
│           └── test/         # CountrySelectCard
│
├── scripts/
│   └── import-opportunities.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/           # 9 migrations au 2026-04-28
│
├── tests/e2e/
│   └── test-profile.spec.ts
│
├── vercel.json               # Cron : send-alerts (lundi 8h) + deadline-alerts (quotidien 7h) ✅
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

# Chariow — Paiement Guide Premium & Coaching
# URLs à récupérer depuis le dashboard Chariow > page produit de chaque offre
NEXT_PUBLIC_CHARIOW_GUIDE_MONTHLY_URL=       # Guide mensuel (2 500 XOF/mois)
NEXT_PUBLIC_CHARIOW_GUIDE_ANNUAL_URL=        # Guide annuel (19 900 XOF/an)
NEXT_PUBLIC_CHARIOW_COACHING_AUDIT_URL=      # Coaching audit (15 000 XOF)
NEXT_PUBLIC_CHARIOW_COACHING_ACCOMPAGNEMENT_URL=  # Coaching complet (50 000 XOF)

# Chariow — Phase 3 (webhooks natifs)
# CHARIOW_WEBHOOK_SECRET=                    # Secret HMAC pour validation des webhooks
# CHARIOW_PRODUCT_GUIDE_MONTHLY_ID=          # ID produit Guide mensuel
# CHARIOW_PRODUCT_GUIDE_ANNUAL_ID=           # ID produit Guide annuel

# Application
NEXT_PUBLIC_APP_URL=https://kraak.co         # URL publique (sans slash final)
CRON_SECRET=                                 # Secret partagé pour sécuriser les endpoints cron Vercel

# CinetPay — Paiement natif (Phase 3, non implémenté)
# CINETPAY_API_KEY=
# CINETPAY_SITE_ID=
# CINETPAY_WEBHOOK_SECRET=

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
| Brute force | Rate limiting Upstash sur `/auth/**` |
| Secrets exposés | URLs Chariow en `NEXT_PUBLIC_` (non sensibles) — clés backend jamais dans le bundle |
| Confusion auth Payload/Supabase | Middleware séparé selon la route (voir section 3.4) |
| IDOR | `user_id` extrait du JWT serveur, jamais du body de la requête |
| Suppression données (RGPD) | Soft delete `User.deleted_at` + anonymisation email |
| Arrondi monétaire (Phase 3) | Montants stockés en `Int` XOF entier — pas de `Float` |
| Webhook spoofing Chariow (Phase 3) | Stub `POST /api/webhooks/chariow` avec validation HMAC prête — activé Phase 3 |
| Token checkout rejouable | `CheckoutSession` à usage unique (PENDING→COMPLETED) + TTL 1h |
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
| Chariow | — | Commission selon plan (voir dashboard) |
| CinetPay (Phase 3) | — | ~2–3% par transaction |
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

Étape 3 — Monétisation MVP (semaines 5–6)
  ├── Guide Premium : 9 modules MDX + gate server-side (GuideSubscription)
  ├── Coaching : pages offres + liens Chariow par offre
  ├── Intégration Chariow : 4 variables NEXT_PUBLIC_CHARIOW_* dans .env.local
  └── Upsells : CoachingUpsell + GuideCard dans ResultsClient

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
| Accès résultats entièrement gratuit | Pivot MVP : maximiser acquisition avant monétisation coaching |
| Chariow pour le paiement MVP | Zéro intégration backend : liens produit hébergés, aucun webhook à gérer, time-to-market immédiat |
| CinetPay repoussé Phase 3 | Valider les volumes et la demande avant d'investir dans une intégration PSP native |
| Zones géographiques continentales | Un étudiant ne doit pas être bloqué par son pays d'origine ; zone = destination |
| Catégories : bourse/programme/fellowship/concours/prix | Exclure stage/emploi classiques — catalogue orienté mobilité académique et distinctions |
| Budget caps (petit=500k, moyen=2M XOF) | Alignés sur les labels affichés dans le questionnaire |
| Bypass multidisciplinaire | Opportunités ouvertes à tous les domaines ne doivent pas être exclues par le filtre domaine |
| Fallback seed si DB < 10 | Garantit un résultat utilisateur même si le catalogue Payload est vide |
| PostHog seule source analytics | Évite la duplication avec une table AnalyticsEvent en base |
| Soft delete sur User | Intégrité référentielle préservée lors d'une suppression RGPD |
| Vitest + Playwright | Standards Next.js pour les tests unitaires et E2E |
| Migration Payload avant Prisma | Protocole obligatoire — évite les conflits de verrous PostgreSQL |
