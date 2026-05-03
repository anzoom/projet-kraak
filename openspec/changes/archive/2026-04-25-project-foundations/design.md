## Context

KRAAK est une nouvelle application full-stack TypeScript ciblant les étudiants africains. Le projet part de zéro — aucun code existant, aucune base de données provisionnée. L'architecture cible est définie dans ARCHITECTURE.md v4.0 et validée.

Contraintes clés :
- TypeScript strict end-to-end, non négociable
- Mobile-first sur réseaux africains limités — JavaScript client minimal via Server Components
- Deux ORM distincts sur la même base PostgreSQL (Prisma pour le métier, Drizzle via Payload pour le CMS) — risque de conflit de verrous lors des migrations
- Deux systèmes d'authentification distincts (Supabase Auth pour les users, Payload Auth pour les admins) — risque de confusion si mal isolés

## Goals / Non-Goals

**Goals:**
- Projet Next.js 14 fonctionnel, typé, déployable sur Vercel
- Base de données Supabase PostgreSQL opérationnelle avec schéma Prisma complet
- Payload CMS admin accessible à `/admin` avec collections Opportunity et AdminUser
- Middleware d'auth qui sépare strictement Supabase JWT et Payload JWT
- Pipeline CI/CD GitHub Actions → Vercel opérationnel
- Fondations sur lesquelles toutes les étapes suivantes (parcours user, paiement, etc.) peuvent s'appuyer immédiatement

**Non-Goals:**
- Questionnaire, scoring, matching — ce sont des étapes ultérieures
- Paiement CinetPay — étape 3
- UI finale ou design system complet — les composants seront construits progressivement
- Import CSV d'opportunités — étape 5
- Tests E2E Playwright — étape 5

## Decisions

### D1 : Next.js 14 App Router (pas Pages Router)
**Décision** : App Router avec Server Components.
**Raison** : Pages Router ne reçoit plus de nouvelles fonctionnalités depuis 2023. Server Components réduisent le JS client de 40–60%, critique pour les réseaux africains. Les API Routes fonctionnent identiquement.
**Alternative écartée** : Pages Router — impasse long-terme.

### D2 : Deux ORM distincts sur la même base PostgreSQL
**Décision** : Prisma pour les entités métier, Drizzle (via Payload) pour les tables CMS.
**Raison** : Payload CMS 3 utilise Drizzle nativement. Forcer Prisma pour tout ou Drizzle pour tout nécessiterait soit de réécrire Payload, soit de migrer la logique métier. La séparation des namespaces de tables évite les conflits.
**Contrainte critique** : Payload migrate DOIT s'exécuter avant Prisma migrate dans le pipeline CI/CD pour éviter les verrous PostgreSQL.

### D3 : Séparation stricte des systèmes d'authentification
**Décision** : Supabase Auth pour les users, Payload Auth pour les admins. Middleware.ts ne touche pas aux routes `/admin/**`.
**Raison** : Mélanger les deux systèmes crée des risques de confusion JWT (un user Supabase ne doit jamais obtenir un accès admin Payload). La séparation au niveau du middleware est la ligne de défense principale.
**Implémentation** : `if (pathname.startsWith('/admin')) return NextResponse.next()` — Payload gère son propre JWT via son middleware embarqué.

### D4 : Montants Payment en Int XOF
**Décision** : Le champ `amount` du modèle `Payment` est de type `Int`, jamais `Float`.
**Raison** : Le XOF est une monnaie entière (pas de centimes). Les flottants en base introduisent des erreurs d'arrondi sur les montants financiers.

### D5 : localStorage pour les réponses au test anonyme
**Décision** : Les réponses au questionnaire sont stockées dans `localStorage` (clé : `kraak_anonymous_session`), pas `sessionStorage`.
**Raison** : `sessionStorage` est vidé à la fermeture de l'onglet. Sur mobile africain, les interruptions (appel entrant, batterie faible) sont fréquentes. `localStorage` survit à ces interruptions.
**Note** : Ce mécanisme sera implémenté à l'étape 2 (parcours user), mais la décision est documentée ici car elle influence la conception des fondations.

### D6 : score_id via cookie HttpOnly après scoring
**Décision** : Le `score_id` est transmis entre l'API de scoring et la page `/results/[scoreId]` via un cookie HttpOnly, pas via un paramètre de requête ou `localStorage`.
**Raison** : Un paramètre de requête est falsifiable côté client. Un cookie HttpOnly n'est pas accessible depuis JavaScript et est transmis automatiquement par le navigateur.

## Risks / Trade-offs

**[Risque] Conflit de verrous PostgreSQL entre les deux ORM** → Mitigation : protocol d'ordre de migration documenté dans ARCHITECTURE.md (Payload d'abord, Prisma ensuite) et enforced dans le pipeline CI/CD via des steps séquentiels.

**[Risque] Payload CMS 3 est relativement récent** → Mitigation : version stable publiée, communauté active. Le projet s'appuie sur les fonctionnalités de base (collections, auth, local API) qui sont stables.

**[Risque] Trois projets Supabase à maintenir** → Mitigation : les trois projets sont identiques en configuration — seuls les secrets diffèrent. Les migrations sont versionnées via Prisma et Payload, reproductibles sur chaque projet.

**[Risque] Overhead de configuration initial important** → Trade-off accepté : un setup rigoureux dès le départ évite les dettes techniques coûteuses (TypeScript tardif, environnements inconsistants, migrations non versionnées).

## Migration Plan

1. Créer le projet Next.js 14 avec `create-next-app` (TypeScript, App Router, Tailwind)
2. Installer et configurer Prisma — écrire le schéma, générer la migration initiale
3. Provisionner les 3 projets Supabase (dev, staging, prod) — récupérer les URLs et clés
4. Intégrer Payload CMS 3 — configurer le `payload.config.ts`, définir les collections
5. Implémenter `src/middleware.ts` — séparation Supabase/Payload
6. Configurer Vercel — lier le repo, créer les 3 environnements, injecter les variables
7. Configurer GitHub Actions — workflow PR + workflow déploiement prod
8. Vérification finale : `tsc --noEmit` ✓, `npm run build` ✓, `/admin` accessible ✓

**Rollback** : Chaque étape est indépendante. En cas d'échec, supprimer les fichiers ajoutés et recommencer l'étape concernée. Les migrations Prisma/Payload peuvent être annulées via `prisma migrate reset` (dev uniquement).

## Open Questions

- **Notchpay** : L'ARCHITECTURE.md mentionne Notchpay comme PSP fallback. L'intégration est hors scope des fondations (étape 3), mais faut-il prévoir les variables d'environnement dès maintenant ? → Décision : oui, les ajouter à `.env.example` pour préparer l'étape 3.
- **Resend** : Même question pour les emails transactionnels. → Décision : ajouter `RESEND_API_KEY` à `.env.example` dès les fondations.
