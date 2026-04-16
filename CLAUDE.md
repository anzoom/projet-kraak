# CLAUDE.md — Projet KRAAK

---

## Aperçu de l'objectif du projet

KRAAK est une plateforme numérique d'orientation et d'accès aux opportunités destinée en priorité aux étudiants africains (16–28 ans, Afrique francophone). Le produit aide l'utilisateur à identifier rapidement les opportunités les plus pertinentes pour son profil (bourses, formations, programmes) et à passer à l'action.

**Proposition de valeur :** "Trouve les opportunités les plus adaptées à ton profil en quelques minutes."

**Objectif MVP :** Valider l'intérêt utilisateur, la pertinence des recommandations et la volonté de payer via un modèle freemium (aperçu gratuit → paywall → accès complet).

**Parcours principal :** Landing → Test de profil (10 questions) → Scoring → Résultats partiels → Paywall → Paiement Mobile Money → Résultats complets.

---

## Aperçu de l'architecture globale

- **Framework :** Next.js 14 App Router (SSR + Server Components) déployé sur Vercel
- **Langage :** TypeScript strict end-to-end — non négociable
- **Base de données :** PostgreSQL via Supabase
- **ORM métier :** Prisma (users, tests, paiements, accès)
- **ORM admin :** Drizzle via Payload CMS (opportunités, admin)
- **Auth utilisateurs :** Supabase Auth (JWT HttpOnly)
- **Auth admin :** Payload CMS Auth (routes `/admin/**` gérées exclusivement par Payload)
- **Paiement :** CinetPay (Mobile Money : Orange Money, MTN MoMo, Wave) + webhook HMAC
- **Styles :** Tailwind CSS + shadcn/ui
- **Observabilité :** PostHog (analytics), Sentry (erreurs), Resend (emails), Upstash (rate limiting)
- **Tests :** Vitest (unitaires + intégration), Playwright (E2E)
- **Environnements :** dev (local) / staging (Vercel branch) / prod (Vercel main)

**Séparation des domaines DB :**
- Tables Payload (Drizzle) : `opportunities`, `admin_users`
- Tables métier (Prisma) : `users`, `test_responses`, `user_profile_scores`, `recommendations`, `payments`, `purchase_accesses`

**Ordre de migration obligatoire :**
```bash
npx payload migrate       # toujours en premier
npx prisma migrate deploy # ensuite
```

---

## Style visuel

- Interface claire et minimaliste
- **Pas de mode sombre pour le MVP**
- Mobile-first — conçu pour les réseaux africains et les appareils milieu de gamme
- CTA visibles et hiérarchisés, copywriting orienté action et confiance
- Contrastes lisibles, taille de texte suffisante, labels explicites

---

## Contraintes et Politiques

- **NE JAMAIS exposer les clés API au client** — toutes les variables sensibles sont côté serveur uniquement (`SUPABASE_SERVICE_ROLE_KEY`, `CINETPAY_WEBHOOK_SECRET`, etc.)
- Les secrets ne doivent jamais apparaître dans le bundle client ni dans le dépôt Git
- Les montants financiers sont stockés en `Int` XOF entier — jamais de `Float`
- L'`user_id` est toujours extrait du JWT serveur, jamais du body de la requête (protection IDOR)
- Validation signature HMAC obligatoire sur le webhook CinetPay
- Idempotence obligatoire sur le webhook : un `psp_transaction_id` ne peut être traité qu'une seule fois
- Toutes les spécifications doivent être rédigées en français, y compris les specs OpenSpec (sections Purpose et Scenarios). Seuls les titres de Requirements doivent rester en anglais avec les mots-clés SHALL/MUST pour la validation OpenSpec.

---

## Dépendances

- **Préférer les composants existants** (shadcn/ui) plutôt que d'ajouter de nouvelles bibliothèques UI
- Vérifier la compatibilité des versions avant toute installation (en particulier Prisma et Payload CMS qui partagent la même base)
- Utiliser les flags non-interactifs pour les commandes CLI (`--yes`, `--no-interactive`) — ne jamais tenter des commandes interactives via Bash

---

## Tests interface graphique

À la fin de chaque développement impliquant l'interface graphique, tester avec le skill Playwright :
- L'interface doit être **responsive** (mobile-first)
- L'interface doit être **fonctionnelle** (parcours utilisateur complet)
- L'interface doit **répondre au besoin développé** (critères d'acceptation du PRD)

---

## Documentation

- **PRD :** [PRD.md](PRD.md) — exigences fonctionnelles, personas, règles métier, KPIs
- **Architecture :** [ARCHITECTURE.md](ARCHITECTURE.md) — stack technique, schéma de données, flux paiement, structure du projet

---

## Context7

Utiliser toujours Context7 lors de la génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie utiliser automatiquement les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation sans qu'il soit nécessaire de le demander explicitement.
