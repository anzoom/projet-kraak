## Why

Le Guide Premium KRAAK (9 modules) existe en version PDF mais n'est pas accessible sur la plateforme. Les utilisateurs premium n'ont pas de raison suffisamment forte de payer : accéder au guide en lecture sur le site et recevoir 3× plus de recommandations matching crée une valeur claire et différenciée par rapport au compte gratuit.

## What Changes

- **Nouveau** : Pages `/guide` (liste publique des 9 modules) et `/guide/[slug]` (contenu d'un module)
- **Nouveau** : Contenu des 9 modules stocké en fichiers MDX statiques (`src/content/guide/`)
- **Nouveau** : Gate d'accès au contenu — non connecté et utilisateur gratuit voient un aperçu (2-3 paragraphes) + CTA vers `/guide-premium` ; les abonnés Guide Premium voient le contenu complet
- **Modifié** : `/results` — les abonnés Guide Premium reçoivent 15 recommandations matching (au lieu de 5 pour les utilisateurs gratuits)
- **Modifié** : Navigation — lien "Guide" ajouté au footer/nav des pages principales

## Capabilities

### New Capabilities

- `guide-content` : Lecture du guide en 9 modules sur la plateforme, avec gate d'accès selon le statut Guide Premium

### Modified Capabilities

- `results-display` : Le nombre de recommandations affichées passe de 5 (fixe) à variable selon l'accès (5 gratuit / 15 premium)

## Impact

- **Nouvelles routes** : `src/app/(app)/(public)/guide/page.tsx`, `src/app/(app)/(public)/guide/[slug]/page.tsx`
- **Nouveau contenu** : `src/content/guide/index.ts` + 9 fichiers `.mdx`
- **Nouvelle dépendance** : `@next/mdx` ou `next-mdx-remote` pour le rendu MDX
- **Fichier modifié** : `src/components/features/results/ResultsClient.tsx` (prop `maxResults`)
- **Fichier modifié** : page résultats server component (check `GuideSubscription` → passe `maxResults`)
- **Fichier modifié** : layouts/nav concernés par le lien Guide
- **Pas de migration DB** : la vérification d'accès utilise `GuideSubscription` déjà en place
