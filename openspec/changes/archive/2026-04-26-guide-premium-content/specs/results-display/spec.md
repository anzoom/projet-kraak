## MODIFIED Requirements

### Requirement: Affichage des recommandations libres
La page SHALL afficher les recommandations matchées selon un plafond variable selon le statut de l'utilisateur : 5 recommandations pour les utilisateurs gratuits (connectés ou non), et 15 recommandations pour les abonnés Guide Premium. Chaque recommandation affiche : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, justification, description courte (si disponible), et un lien de candidature (si `source_url` défini).

#### Scenario: Cinq recommandations affichées pour un utilisateur gratuit
- **WHEN** le matching produit au moins 5 recommandations et l'utilisateur n'a pas de GuideSubscription active
- **THEN** exactement 5 recommandations sont affichées, triées par `match_score` décroissant

#### Scenario: Quinze recommandations affichées pour un abonné premium
- **WHEN** le matching produit au moins 15 recommandations et l'utilisateur a une GuideSubscription active
- **THEN** exactement 15 recommandations sont affichées, triées par `match_score` décroissant

#### Scenario: Moins de recommandations que le plafond
- **WHEN** le matching produit moins de recommandations que le plafond applicable
- **THEN** toutes les recommandations disponibles sont affichées sans erreur

#### Scenario: Catalogue vide — message dédié
- **WHEN** aucune opportunité n'est disponible (ni Payload ni seed)
- **THEN** la page affiche un message "Catalogue en cours de construction" sans erreur

#### Scenario: Description courte affichée dans la card
- **WHEN** une recommandation a un champ `short_description` non nul
- **THEN** ce texte est affiché sous le titre de l'opportunité dans la card

#### Scenario: Bouton Voir les détails affiché sur la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** un bouton "Voir les détails" est affiché sur la card, ouvrant la modale de détail

#### Scenario: Bouton Postuler absent de la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** aucun bouton "Postuler" n'est affiché directement sur la card

### Requirement: Nudge upgrade après la cinquième recommandation (utilisateurs gratuits)
La page `/results` SHALL afficher, après la 5ème recommandation et uniquement pour les utilisateurs sans GuideSubscription active, un bloc d'incitation à passer au Guide Premium mentionnant les 10 recommandations supplémentaires disponibles.

#### Scenario: Nudge affiché après la 5ème reco pour un utilisateur gratuit
- **WHEN** un utilisateur gratuit a au moins 5 recommandations affichées
- **THEN** un bloc nudge "10 recommandations supplémentaires disponibles avec le Guide Premium" est affiché sous la 5ème recommandation avec un CTA vers `/guide-premium`

#### Scenario: Nudge absent pour un abonné premium
- **WHEN** un utilisateur avec GuideSubscription active consulte ses résultats
- **THEN** aucun nudge upgrade n'est affiché dans la liste de recommandations
