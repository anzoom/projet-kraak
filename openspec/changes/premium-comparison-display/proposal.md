## Why

Après la définition des métriques Option B (Classic : quota 10 / affichage 5+5 ; Premium : quota 20 / affichage 10+10 / saves cap 15), ces informations étaient cohérentes dans le code et la documentation mais **invisibles pour l'utilisateur**. Aucune page ne montrait clairement la différence concrète entre les deux niveaux d'accès.

Un utilisateur consultant `/results` ne perçoit pas ce qu'il gagnerait à passer Premium. Un utilisateur sur `/guide-premium` voyait une liste de features textuelles sans ancrage chiffré. La valeur de l'upgrade est floue, ce qui freine la conversion.

## What Changes

- **Nouveau** : Section comparaison Classic vs Premium dans `/guide-premium` — deux cartes côte à côte (blanc / orange) affichant les métriques clés avec checkmarks visuels
- **Nouveau** : Bloc upgrade teaser dans `/results` — affiché après la liste des recommandations pour les utilisateurs Classic authentifiés, reprenant la comparaison 10 vs 20 pour inciter à passer Premium
- **Modifié** : `PremiumSection` sur la landing — ajout d'une ligne de métriques chiffrées (10 → 20 recommandations) sous la description du Guide Premium

## Capabilities

### New Capabilities

- `guide-premium-landing` : Affichage de la comparaison Classic/Premium avec métriques chiffrées

### Modified Capabilities

- `results-display` : Bloc upgrade teaser Classic → Premium après les recommandations
- `landing-page` : Métriques chiffrées dans PremiumSection
