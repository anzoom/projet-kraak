## MODIFIED Requirements

### Requirement: Affichage des recommandations libres
La page SHALL afficher les 2 premières `Recommendation[]` (triées par `match_score` décroissant) avec : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, et justification. Si un `PurchaseAccess` actif (non expiré) existe pour l'utilisateur courant et le `score_id` courant, toutes les recommandations SHALL être affichées sans paywall.

#### Scenario: Deux recommandations libres visibles (sans accès)
- **WHEN** le matching produit au moins 2 recommandations et l'utilisateur n'a pas de PurchaseAccess actif
- **THEN** les 2 premières sont affichées complètement et le paywall est affiché pour le reste

#### Scenario: Toutes les recommandations visibles (avec accès payant)
- **WHEN** l'utilisateur a un PurchaseAccess actif non expiré pour ce score_id
- **THEN** toutes les recommandations sont affichées sans section paywall

#### Scenario: Moins de 2 recommandations disponibles
- **WHEN** le matching produit 0 ou 1 recommandation
- **THEN** seules les disponibles sont affichées, sans erreur

#### Scenario: Catalogue vide — message dédié
- **WHEN** aucune opportunité n'est disponible (ni Payload ni seed)
- **THEN** la page affiche un message "Catalogue en cours de construction" sans erreur

## ADDED Requirements

### Requirement: Vérification server-side du PurchaseAccess
Le Server Component `ResultsPage` SHALL interroger Prisma pour vérifier si l'utilisateur courant possède un `PurchaseAccess` actif (`expires_at > now()`) pour le `score_id` courant, et passer `hasAccess: boolean` à `ResultsClient`.

#### Scenario: PurchaseAccess actif détecté
- **WHEN** l'utilisateur a un PurchaseAccess avec expires_at dans le futur
- **THEN** `hasAccess: true` est passé à ResultsClient et toutes les recommandations sont déverrouillées

#### Scenario: PurchaseAccess expiré non pris en compte
- **WHEN** l'utilisateur a un PurchaseAccess avec expires_at dans le passé
- **THEN** `hasAccess: false` est passé à ResultsClient et le paywall est affiché normalement
