## 1. Dépendance et infrastructure

- [x] 1.1 Installer `next-mdx-remote` et vérifier la compatibilité avec la version Next.js du projet
- [x] 1.2 Créer `src/content/guide/index.ts` avec les métadonnées des 9 modules (slug, titre, icône, description courte, ordre)

## 2. Contenu MDX des modules

- [x] 2.1 Créer `src/content/guide/01-mindset.mdx` avec le contenu du module Mindset
- [x] 2.2 Créer `src/content/guide/02-cartographie.mdx` avec le contenu du module Cartographie
- [x] 2.3 Créer `src/content/guide/03-profil.mdx` avec le contenu du module Profil
- [x] 2.4 Créer `src/content/guide/04-dossier.mdx` avec le contenu du module Dossier
- [x] 2.5 Créer `src/content/guide/05-redaction.mdx` avec le contenu du module Rédaction
- [x] 2.6 Créer `src/content/guide/06-entretien.mdx` avec le contenu du module Entretien
- [x] 2.7 Créer `src/content/guide/07-admin.mdx` avec le contenu du module Admin
- [x] 2.8 Créer `src/content/guide/08-depart.mdx` avec le contenu du module Départ
- [x] 2.9 Créer `src/content/guide/09-strategies.mdx` avec le contenu du module Stratégies avancées

## 3. Utilitaire gate d'accès

- [x] 3.1 Créer `src/lib/guide.ts` avec la fonction `extractPreview(source: string, paragraphs?: number): string` qui extrait les N premiers paragraphes d'un fichier MDX
- [x] 3.2 Créer `src/lib/guide.ts` — ajouter `hasGuideAccess(userId: string): Promise<boolean>` qui vérifie la GuideSubscription active via Prisma (réutilise le pattern de `/catalog/page.tsx`)

## 4. Page liste des modules (`/guide`)

- [x] 4.1 Créer `src/app/(app)/(public)/guide/page.tsx` — Server Component public affichant la liste des 9 modules depuis `src/content/guide/index.ts`
- [x] 4.2 Ajouter le CTA "Obtenir le Guide Premium" pointant vers `/guide-premium` dans la page liste
- [x] 4.3 Afficher un indicateur visuel "accès complet" sur la page liste pour les abonnés premium (check `hasGuideAccess`)

## 5. Page contenu d'un module (`/guide/[slug]`)

- [x] 5.1 Créer `src/app/(app)/(public)/guide/[slug]/page.tsx` — Server Component qui charge le fichier MDX selon le slug
- [x] 5.2 Implémenter le gate côté serveur : appeler `hasGuideAccess` → transmettre le MDX complet ou le preview (via `extractPreview`)
- [x] 5.3 Afficher le bloc CTA "Accéder au guide complet" (→ `/guide-premium`) pour les utilisateurs gratuits connectés après l'aperçu
- [x] 5.4 Afficher le bloc CTA double "Créer un compte" / "Se connecter" pour les visiteurs non authentifiés après l'aperçu
- [x] 5.5 Implémenter la navigation "Module précédent / suivant" pour les abonnés premium
- [x] 5.6 Retourner `notFound()` pour les slugs inexistants

## 6. Résultats — plafond variable selon accès premium

- [x] 6.1 Modifier `src/app/(app)/(public)/results/page.tsx` — ajouter le check `hasGuideAccess` en parallèle de `fetchOpportunities()` et passer la prop `maxResults` (5 ou 15) à `ResultsClient`
- [x] 6.2 Modifier `src/components/features/results/ResultsClient.tsx` — remplacer `const MAX_RESULTS = 5` par la prop `maxResults: number`
- [x] 6.3 Ajouter le nudge upgrade après la 5ème recommandation dans `ResultsClient` — visible uniquement si `maxResults === 5` (utilisateur gratuit), avec CTA vers `/guide-premium`

## 7. Navigation

- [x] 7.1 Modifier `src/components/features/results/ResultsHeaderMenu.tsx` — ajouter un lien "Guide" vers `/guide` dans le dropdown menu
