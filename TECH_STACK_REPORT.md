# Rapport de comparaison — Tech Stack KRAAK MVP
**Date :** Avril 2026
**Contexte :** Analyse des options techniques pour le MVP de KRAAK

---

## 1. Contraintes structurantes issues du PRD

Avant toute comparaison, ces contraintes non négociables guident l'évaluation :

| Contrainte | Impact sur le choix technique |
|---|---|
| **Mobile-first, Afrique francophone** | Bundle léger, chargement <3s sur réseau moyen, RTT long |
| **Mobile Money en priorité** | Intégration CinetPay / Notchpay / Fedapay obligatoire |
| **MVP rapide à livrer** | DX élevée, framework full-stack ou BaaS |
| **Back-office admin intégré** | Éviter de construire deux apps séparées |
| **Équipe réduite (1-2 devs)** | Une seule techno principale, pas de polyglossie |
| **Scoring déterministe et modifiable** | Logique métier isolable, pas d'IA générative au MVP |
| **Extension future** | Mentorat, marketplace, parent dashboard — architecture modulaire |
| **Sécurité** | Auth, RBAC, protection XSS/CSRF, TLS, rate limiting |
| **Observabilité** | Analytics produit, error tracking, logs |

---

## 2. Axes d'évaluation

Chaque option est notée sur 5 axes (1–5) :

- **Vitesse de livraison** : rapidité pour sortir le MVP
- **Performance mobile** : poids du bundle, TTI sur réseau 3G africain
- **Écosystème paiement** : facilité d'intégration Mobile Money
- **Admin inclus ou simple** : coût pour construire le back-office
- **Maintenabilité & scalabilité** : capacité à évoluer vers Phase 2/3

---

## 3. Options comparées

### Option A — Next.js + Supabase (Full-Stack JS/TS)

**Stack :**
- **Frontend + API :** Next.js 14+ (App Router, Server Components)
- **Base de données :** PostgreSQL via Supabase
- **Auth :** Supabase Auth (JWT, OAuth)
- **ORM :** Prisma
- **Admin :** Section `/admin` protégée dans la même app Next.js
- **Paiement :** CinetPay SDK ou Notchpay (webhook + API)
- **Hébergement :** Vercel (frontend + API routes) + Supabase (DB)
- **Analytics :** PostHog (open-source, auto-hébergeable)
- **Erreurs :** Sentry

**Forces :**
- Stack TypeScript unifiée — un seul langage du frontend au backend
- Supabase : DB + Auth + Storage + Realtime sur un tier gratuit généreux
- Next.js Server Components réduisent la JS envoyée au client → excellent pour mobile lent
- Vercel Edge Network : CDN mondial, TTFB très faible même depuis l'Afrique
- Ecosystème npm mature pour intégrer CinetPay, Notchpay, Fedapay
- Prisma génère des types depuis le schéma DB → sécurité de type end-to-end
- Déploiement en minutes (git push → live)
- Communauté massive, documentation abondante

**Faiblesses :**
- L'admin panel doit être construit manuellement (pas de backoffice clé en main)
- Les Server Actions et App Router ont une courbe d'apprentissage si le dev est junior
- Coûts Vercel peuvent augmenter à forte charge (mais pas un problème MVP)
- Cold starts sur fonctions serverless (atténué par Supabase edge functions)

**Scores :**
| Axe | Note |
|---|---|
| Vitesse de livraison | 4/5 |
| Performance mobile | 5/5 |
| Écosystème paiement Mobile Money | 4/5 |
| Admin inclus | 2/5 |
| Maintenabilité & scalabilité | 5/5 |
| **Total** | **20/25** |

---

### Option B — Next.js Frontend + Django REST Framework Backend

**Stack :**
- **Frontend :** Next.js (ou React SPA)
- **Backend/API :** Django + Django REST Framework (Python)
- **Admin :** Django Admin (natif, gratuit, puissant)
- **Auth :** SimpleJWT ou django-allauth
- **ORM :** Django ORM (natif)
- **Base de données :** PostgreSQL (Railway ou Render)
- **Paiement :** CinetPay Python SDK / Notchpay / appels API directs
- **Hébergement :** Vercel (frontend) + Railway ou Render (Django)
- **Analytics :** PostHog ou Mixpanel

**Forces :**
- **Django Admin résout immédiatement le back-office** : CRUD opportunités, gestion utilisateurs, tableau de bord — sans écrire une ligne de code admin
- Python idéal pour le moteur de scoring (logique métier lisible, testable, extensible)
- Django ORM + migrations : gestion du schéma robuste et mature
- Excellente sécurité out-of-the-box (CSRF, XSS, SQL injection protection natifs)
- Future IA/ML ? Python est le langage naturel pour étendre vers recommandations IA (Phase 3)

**Faiblesses :**
- **Deux langages** : TypeScript + Python → deux codebases, deux CI/CD, deux équipes
- Latence inter-service (frontend → backend API) sur réseaux africains lents
- Déploiement plus complexe : deux services à héberger et surveiller
- Django Admin est fonctionnel mais peu élégant — UX admin limitée
- Moins de synergies type-safety entre front et back (pas de types partagés sans effort)
- Coûts d'hébergement plus élevés (Render/Railway pour Django)

**Scores :**
| Axe | Note |
|---|---|
| Vitesse de livraison | 3/5 |
| Performance mobile | 4/5 |
| Écosystème paiement Mobile Money | 4/5 |
| Admin inclus | 5/5 |
| Maintenabilité & scalabilité | 4/5 |
| **Total** | **20/25** |

---

### Option C — Laravel + Filament (PHP Full-Stack)

**Stack :**
- **Full-Stack :** Laravel 11 (PHP 8.3)
- **Frontend :** Livewire 3 + Alpine.js (ou Inertia.js + React/Vue)
- **Admin :** Filament 3 (admin panel Laravel open-source, excellent DX)
- **Auth :** Laravel Sanctum / Breeze
- **ORM :** Eloquent (natif Laravel)
- **Base de données :** MySQL ou PostgreSQL
- **Paiement :** CinetPay PHP SDK, intégration webhook
- **Hébergement :** Laravel Forge + DigitalOcean, ou Railway
- **Queue/Jobs :** Laravel Queue (emails, notifications, events)

**Forces :**
- **Filament Admin est le meilleur admin panel open-source du marché** : CRUD visuel, formulaires, tableaux, filtres, graphes — en quelques lignes de code
- Framework batteries-included : auth, queues, emails, jobs, events, cache — tout natif
- Eloquent ORM très productif pour prototyper rapidement
- Laravel Telescope pour le debugging et l'observabilité (local et staging)
- Livewire permet des interfaces réactives sans écrire de JS complexe
- Communauté active, nombreux packages pour l'Afrique (voir `bagonzimana/laravel-cinetpay`)
- Idéal pour une équipe réduite : **un seul développeur PHP peut tout faire** du CRUD à l'API

**Faiblesses :**
- PHP perçu comme moins moderne — recrutement plus difficile que JS/Python
- Performance mobile dépend de l'optimisation manuelle (pas de Server Components natifs)
- Livewire ajoute du poids vs React/Next.js pour certaines interactions complexes
- Moins adapté si l'équipe ne maîtrise pas PHP
- Hébergement traditionnel (serveur dédié ou VPS) plus coûteux et complexe à gérer qu'une architecture serverless
- Pas de type-safety native à l'échelle d'un projet TypeScript

**Scores :**
| Axe | Note |
|---|---|
| Vitesse de livraison | 5/5 |
| Performance mobile | 3/5 |
| Écosystème paiement Mobile Money | 4/5 |
| Admin inclus | 5/5 |
| Maintenabilité & scalabilité | 3/5 |
| **Total** | **20/25** |

---

### Option D — T3 Stack (Next.js + tRPC + Prisma)

**Stack :**
- **Frontend + Backend :** Next.js App Router
- **API Layer :** tRPC (type-safe API sans OpenAPI ni REST classique)
- **ORM :** Prisma
- **Auth :** NextAuth.js v5 (ou Clerk)
- **Base de données :** PostgreSQL (Neon ou Supabase)
- **Admin :** À construire manuellement
- **Paiement :** CinetPay ou Notchpay
- **Hébergement :** Vercel

**Forces :**
- Type safety absolue de la DB au frontend sans génération de code
- Excellent DX pour équipes TypeScript seniors
- tRPC élimine toute la glue REST (pas de serialisation manuelle, pas d'OpenAPI)
- Très bon support dans la communauté Next.js

**Faiblesses :**
- **Suringénierie pour un MVP** : tRPC ajoute une couche d'abstraction non nécessaire à ce stade
- Admin entièrement à construire
- Courbe d'apprentissage de tRPC si équipe pas familière
- Les Server Actions de Next.js 14 font désormais beaucoup de ce que tRPC faisait
- Moins adapté si l'équipe n'est pas 100% TypeScript experte

**Scores :**
| Axe | Note |
|---|---|
| Vitesse de livraison | 3/5 |
| Performance mobile | 5/5 |
| Écosystème paiement Mobile Money | 3/5 |
| Admin inclus | 1/5 |
| Maintenabilité & scalabilité | 4/5 |
| **Total** | **16/25** |

---

### Option E — Supabase-First (BaaS Maximal)

**Stack :**
- **Frontend :** Next.js ou React
- **Backend :** Supabase (Edge Functions en TypeScript pour la logique métier)
- **Auth :** Supabase Auth natif
- **DB :** PostgreSQL Supabase avec Row Level Security (RLS)
- **Admin :** Dashboard Supabase (limité) ou Retool
- **Paiement :** CinetPay webhook → Edge Function → mise à jour DB

**Forces :**
- Zéro backend à maintenir pour les opérations CRUD standard
- RLS (Row Level Security) = sécurité au niveau DB → très puissant
- Realtime natif (utile pour des futures features)
- Tier gratuit très généreux pour l'early-stage

**Faiblesses :**
- **Edge Functions Supabase peu adaptées à la logique métier complexe** (scoring, matching)
- Admin panel inexistant nativement → Retool est payant au-delà du tier gratuit
- Vendor lock-in fort sur Supabase
- Debugging et observabilité limités en production
- Scaling horizontal limité par les contraintes de Supabase

**Scores :**
| Axe | Note |
|---|---|
| Vitesse de livraison | 4/5 |
| Performance mobile | 4/5 |
| Écosystème paiement Mobile Money | 3/5 |
| Admin inclus | 2/5 |
| Maintenabilité & scalabilité | 2/5 |
| **Total** | **15/25** |

---

## 4. Tableau récapitulatif

| Critère | **A — Next+Supabase** | **B — Next+Django** | **C — Laravel+Filament** | **D — T3 Stack** | **E — BaaS Supabase** |
|---|:---:|:---:|:---:|:---:|:---:|
| Vitesse de livraison | 4 | 3 | 5 | 3 | 4 |
| Performance mobile | 5 | 4 | 3 | 5 | 4 |
| Paiement Mobile Money | 4 | 4 | 4 | 3 | 3 |
| Admin back-office | 2 | 5 | 5 | 1 | 2 |
| Maintenabilité / Scale | 5 | 4 | 3 | 4 | 2 |
| **Total** | **20** | **20** | **20** | **16** | **15** |
| Langage(s) | TypeScript | TS + Python | PHP | TypeScript | TypeScript |
| Complexité déploiement | Faible | Élevée | Moyenne | Faible | Faible |
| Coût MVP estimé | ~0–20$/mois | ~20–40$/mois | ~20–40$/mois | ~0–20$/mois | ~0$/mois |

---

## 5. Analyse décisionnelle approfondie

### Le problème de l'admin (éliminateur de stacks)

Le PRD exige un back-office fonctionnel dès le MVP (CRUD opportunités, suivi paiements, KPIs). Les Options A, D et E nécessitent de le **construire de zéro**, ce qui représente 20–30% du temps de développement supplémentaire.

**Solution pour l'Option A :** Intégrer **Payload CMS** (TypeScript natif, admin panel inclus, s'intègre nativement avec Next.js App Router et PostgreSQL) ou construire un `/admin` minimaliste avec des librairies de tables (TanStack Table + shadcn/ui).

> **Payload CMS** est la réponse TypeScript-native au problème de l'admin : il génère un back-office complet depuis le schéma de données, s'auto-héberge, supporte PostgreSQL, et le panneau admin est beau et fonctionnel dès le départ.

### Performance mobile en Afrique

Les réseaux 3G africains ont un RTT moyen de 200–400ms et une bande passante de 1–5 Mbps. Les Server Components de Next.js 14 sont une réponse technique directe à ce problème : le HTML est généré côté serveur, l'hydratation JS est minimale, le First Contentful Paint est bien meilleur qu'une SPA pure.

Laravel avec Livewire génère du HTML côté serveur aussi, mais chaque interaction utilisateur fait un aller-retour serveur → plus sensible à la latence réseau.

### Paiements Mobile Money en Afrique francophone

Les prestataires à intégrer pour KRAAK selon la géographie cible :

| Pays | PSP recommandé | SDK disponible |
|---|---|---|
| Sénégal, Côte d'Ivoire, Cameroun, Burkina, Mali, Togo | **CinetPay** | Node.js, PHP, Python |
| Sénégal (Wave dominant) | **Notchpay** ou API Wave | REST API |
| Bénin, Togo, Niger | **Fedapay** | Node.js, PHP |
| Cameroun | **Campay** | REST API |

**CinetPay est le choix de démarrage** : couvre le plus grand nombre de pays francophones, supporte Orange Money, MTN MoMo, Moov, Wave. SDK Node.js disponible → compatible Next.js.

### Moteur de scoring

Le PRD spécifie que les règles doivent être **modifiables sans refonte majeure**. Cela plaide pour :
- Un fichier de configuration JSON/YAML définissant les règles de scoring
- Une fonction pure TypeScript ou Python qui prend les réponses et retourne un score
- Tests unitaires exhaustifs sur cette logique isolée

Cette logique fonctionne dans n'importe quel stack — ce n'est pas un facteur différenciant.

---

## 6. Recommandation finale

### Stack recommandé : Next.js 14 + Payload CMS + Supabase + CinetPay

```
Frontend & API        →  Next.js 14 (App Router + Server Components)
Admin back-office     →  Payload CMS 3.x (TypeScript, PostgreSQL-native)
Base de données       →  PostgreSQL (Supabase)
Authentification      →  Supabase Auth (JWT + OAuth)
ORM                   →  Prisma (ou Payload ORM natif)
Paiement              →  CinetPay (+ Notchpay en fallback)
Hébergement app       →  Vercel (Edge Network mondial)
Hébergement DB        →  Supabase (tier gratuit → pro selon traction)
Analytics produit     →  PostHog (auto-hébergeable si besoin RGPD)
Error tracking        →  Sentry (tier gratuit suffisant au MVP)
Emails transactionnels→  Resend (React Email + Next.js, DX excellent)
Langage               →  TypeScript (100% du projet)
```

### Pourquoi cette combinaison gagne

**1. Un seul langage, une seule équipe**
TypeScript du schéma DB aux composants UI. Pas de context-switching entre PHP et TS, Python et TS. Le développeur qui écrit le moteur de scoring écrit aussi les composants React.

**2. Payload CMS résout l'admin sans sacrifice**
Payload CMS v3 est une bibliothèque TypeScript qui s'intègre directement dans Next.js App Router. L'admin panel est généré depuis le schéma de données — CRUD opportunités, gestion des utilisateurs, suivi des paiements, publication/dépublication — tout disponible dès le premier jour. Il utilise le même PostgreSQL que l'app, sans service supplémentaire.

**3. Performance mobile optimale**
Les Server Components de Next.js 14 envoient du HTML pur sans JS inutile. La taille du bundle client est réduite de 40–60% vs une SPA React classique. Vercel dispose de points de présence en Afrique du Sud, Nigéria, et en Europe (faible latence pour les diasporas).

**4. Supabase couvre auth + DB + storage gratuitement au MVP**
Tier gratuit : 500MB DB, 1GB storage, 50,000 utilisateurs actifs/mois. Le passage au tier Pro (25$/mois) se fait quand la traction est réelle.

**5. CinetPay couvre la géographie cible**
Intégration via webhooks HTTPS + vérification côté serveur dans les API Routes Next.js. Pattern éprouvé, sécurisé, sans stocker d'informations de paiement côté app.

**6. Extensible vers les phases futures**
- Mentorat → nouveaux modèles Payload + nouvelles pages Next.js
- Marketplace → Stripe Connect ou extension CinetPay marketplace
- IA/ML recommandations → appels à une API Python externe sans toucher au stack principal

### Architecture simplifiée

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Edge)                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Next.js 14 App Router                 │  │
│  │                                                    │  │
│  │  /          Landing page (SSG)                     │  │
│  │  /test       Questionnaire (SSR + client state)    │  │
│  │  /results    Résultats + Paywall (SSR)              │  │
│  │  /dashboard  Espace utilisateur (SSR)               │  │
│  │  /admin      Payload CMS Admin Panel               │  │
│  │                                                    │  │
│  │  /api/scoring       Moteur de scoring              │  │
│  │  /api/matching      Moteur de matching             │  │
│  │  /api/payment       Webhook CinetPay               │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌──────────────────┐
│  Supabase       │          │  External Services│
│  PostgreSQL DB  │          │                  │
│  Supabase Auth  │          │  CinetPay        │
│  Storage        │          │  PostHog         │
│                 │          │  Sentry          │
│                 │          │  Resend          │
└─────────────────┘          └──────────────────┘
```

### Coûts estimés MVP

| Service | Tier gratuit | Tier payant |
|---|---|---|
| Vercel | 100GB bandwidth/mois | Pro : 20$/mois |
| Supabase | 500MB DB, 50K users | Pro : 25$/mois |
| PostHog | 1M events/mois | Scale : selon volume |
| Sentry | 5K errors/mois | Team : 26$/mois |
| Resend | 3K emails/mois | Pro : 20$/mois |
| CinetPay | Commission par transaction | ~1.5–3.5% |
| **Total MVP** | **~0$/mois** | **<100$/mois si traction** |

---

## 7. Quand choisir autrement

| Si... | Alors considérer... |
|---|---|
| L'équipe est exclusivement PHP | **Laravel + Filament** (livraison admin excellente) |
| Besoin d'IA/ML dès le MVP | **Next.js + FastAPI** (Python pour scoring + ML) |
| Budget hosting zéro absolu | **BaaS Supabase** (mais admin Retool payant au-delà) |
| Équipe 1 dev senior TypeScript expérimenté | **T3 Stack** (maximum type-safety) |

---

## 8. Prochaines étapes recommandées

1. **Choisir le stack** (cette décision)
2. **Configurer le repo** : Next.js + Payload CMS + Supabase + Prisma
3. **Définir le schéma de données** : User, Opportunity, TestResponse, UserProfileScore, Payment, PurchaseAccess
4. **Implémenter le moteur de scoring** en TypeScript pur avec tests unitaires
5. **Intégrer CinetPay** en sandbox avant la mise en production
6. **Déployer le projet vide** sur Vercel + Supabase dès le jour 1 (CI/CD d'emblée)
7. **Alimenter la base** : 30–50 opportunités qualifiées minimum avant lancement

---

*Rapport généré dans le cadre du projet KRAAK — MVP V1+*
