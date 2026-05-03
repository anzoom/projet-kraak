## 1. Page /guide-premium — comparaison Classic vs Premium

- [x] 1.1 Ajouter les imports `Check` et `X` depuis `lucide-react`
- [x] 1.2 Insérer la grille `grid grid-cols-2 gap-3` entre le hero et la section UPCOMING
- [x] 1.3 Colonne Classic : chiffre `5`, checkmarks vert/gris pour 4 features
- [x] 1.4 Colonne Premium : chiffre `20`, tous avantages cochés + badge `×4`
- [x] 1.5 Vérifier le rendu mobile (390px) via Playwright screenshot

## 2. Page /results — bloc upgrade teaser

- [x] 2.1 Ajouter un bloc upgrade teaser dans `ResultsClient.tsx` après les recommandations
- [x] 2.2 Conditionner l'affichage : `!isPremium && !showFavorites && isAuthenticated`
- [x] 2.3 Texte : "Passe en Premium — 4× plus (jusqu'à 20 recommandations vs 5), 15 favoris sauvegardables"
- [x] 2.4 CTA : lien `<Link href="/guide-premium">` avec style outline primary
- [x] 2.5 Vérifier que le teaser n'apparaît pas en mode favoris ni pour les futurs comptes Premium

## 3. Landing — métriques dans PremiumSection

- [x] 3.1 Ajouter une ligne de chips métriques sous la description de la carte Guide Premium dans `PremiumSection.tsx`
- [x] 3.2 Chips : `jusqu'à 20 recommandations` et `+15 favoris` en style `bg-white/10 text-white/60`
- [x] 3.3 Vérifier l'alignement responsive sur mobile (390px) et desktop (1280px)

## 4. Tests et validation

- [x] 4.1 Vérifier TypeScript (`tsc --noEmit`) — aucune erreur
- [x] 4.2 Lancer la suite E2E Playwright — 70/78 tests passés
- [x] 4.3 Screenshot mobile de `/guide-premium`, `/results` et `/` pour validation visuelle
