## Context

Le Guide Premium KRAAK est un document de 9 modules (Mindset, Cartographie, Profil, Dossier, Rédaction, Entretien, Admin, Départ, Stratégies avancées) conçu comme un "guide vivant". Il existe en version PDF mais n'est pas encore accessible sur la plateforme.

Aujourd'hui, l'accès premium (`GuideSubscription`) donne accès au `/catalog` (browse complet des opportunités). La feature à développer enrichit le premium avec deux nouvelles valeurs : lecture du guide sur le site et 3× plus de recommandations matching (15 vs 5 pour le gratuit).

Le modèle d'accès `GuideSubscription` est déjà en place en Prisma et utilisé dans `/catalog/page.tsx` — la vérification sera réutilisée sans modification de schéma.

## Goals / Non-Goals

**Goals:**
- Pages `/guide` (liste publique des modules) et `/guide/[slug]` (contenu d'un module)
- Gate d'accès côté serveur : preview (2-3 paragraphes) pour non-premium, contenu complet pour abonnés
- 15 recommandations matching dans `/results` pour les abonnés Guide Premium (vs 5 pour gratuits)
- Lien "Guide" dans le menu header des pages connectées (ResultsHeaderMenu)

**Non-Goals:**
- Éditeur admin pour le contenu guide (les MDX sont versionnés dans le repo)
- Pagination du catalogue — hors scope
- Blur CSS côté client (le gate est serveur-side, pas de fuite de contenu)
- Nouveau modèle de paiement ou changement tarifaire

## Decisions

### D1 — Stockage du contenu : MDX statique (vs Payload CMS)

**Choix : MDX statique** dans `src/content/guide/`.

Rationale : le contenu guide est stable (9 modules finis), pas besoin d'édition fréquente sans deploy. Payload CMS impliquerait une migration Drizzle, un éditeur Lexical à configurer et un rendu custom. MDX est zéro-infra, versionné avec le code et renderé nativement par Next.js via `next-mdx-remote`.

Alternative écartée : Payload GuideModule collection — valeur trop faible pour la complexité ajoutée au MVP.

### D2 — Rendu MDX : next-mdx-remote (vs @next/mdx)

**Choix : `next-mdx-remote`** pour le rendu MDX dans les Server Components.

Rationale : `@next/mdx` exige une configuration webpack globale et ne gère pas bien le contenu dynamique (slug-based routing). `next-mdx-remote/rsc` est conçu pour les Server Components et permet de charger le fichier MDX à la demande selon le slug.

### D3 — Gate d'accès : serveur-side (vs blur CSS client)

**Choix : gate serveur-side** — le Server Component lit le fichier MDX complet, extrait les N premiers paragraphes pour les non-premium, et ne renvoie que ce fragment au client.

Rationale : le blur CSS est une protection visuelle uniquement. Le contenu est dans le HTML et accessible via DevTools. Le gate serveur garantit que les abonnés non-premium ne reçoivent jamais le contenu complet.

Implémentation : la fonction `extractPreview(source: string, paragraphs: number): string` extrait les N premiers paragraphes du MDX brut avant de le passer à `next-mdx-remote`.

### D4 — maxResults dans ResultsClient : prop passée depuis la page

**Choix : prop `maxResults: number`** ajoutée à `ResultsClient`.

Rationale : `ResultsPage` est un Server Component qui peut appeler Prisma directement (pattern identique à `/catalog/page.tsx`). Il détermine `maxResults` (5 ou 15) selon la `GuideSubscription` active, puis le passe en prop. `ResultsClient` remplace `const MAX_RESULTS = 5` par `props.maxResults`.

Pas de nouvel endpoint API — la vérification d'accès se fait dans le Server Component.

### D5 — Placement du lien Guide : ResultsHeaderMenu

**Choix : lien "Guide" dans `ResultsHeaderMenu`** (dropdown du header des résultats).

Rationale : les pages résultats sont le point d'entrée principal des utilisateurs connectés. Le dropdown "Mon profil" est déjà là. Ajouter "Guide" dans ce menu est le chemin de découverte naturel sans polluer la navigation.

Alternative : footer global — moins visible, dépend des pages qui ont un footer.

## Risks / Trade-offs

- **[Risque] Taille des MDX dans le bundle** → Mitigation : `next-mdx-remote` charge les fichiers à la demande (pas d'import statique global), pas de bundle overhead.
- **[Risque] Le check GuideSubscription dans ResultsPage ajoute une requête DB** → Mitigation : la requête est légère (findFirst sur un index) et se fait en parallèle avec `fetchOpportunities()` via `Promise.all`.
- **[Trade-off] MDX non éditable sans deploy** → Acceptable pour le MVP. Migration Payload CMS possible en V2 si le contenu évolue fréquemment.
- **[Risque] next-mdx-remote nouvelle dépendance** → Package stable, largement utilisé dans l'écosystème Next.js, pas de conflit connu avec les dépendances existantes.

## Migration Plan

1. Installer `next-mdx-remote`
2. Créer `src/content/guide/index.ts` (metadata des 9 modules)
3. Créer les 9 fichiers `.mdx` avec le contenu des modules
4. Créer `src/app/(app)/(public)/guide/page.tsx` (liste, public)
5. Créer `src/app/(app)/(public)/guide/[slug]/page.tsx` (contenu, gate serveur)
6. Modifier `ResultsPage` : check GuideSubscription → prop `maxResults`
7. Modifier `ResultsClient` : `MAX_RESULTS` → prop `maxResults`, nudge upgrade sous reco #5
8. Modifier `ResultsHeaderMenu` : ajouter lien "Guide"

Pas de rollback DB nécessaire (aucune migration). Rollback = revert du code.
