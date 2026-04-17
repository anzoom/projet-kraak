### Requirement: Section paywall affichée après les recommandations libres
Lorsque le matching produit plus de 2 recommandations, la page SHALL afficher une section paywall indiquant le nombre d'opportunités supplémentaires verrouillées, la valeur débloquée après paiement, le prix, et un CTA principal.

#### Scenario: Paywall visible avec opportunités verrouillées
- **WHEN** le matching produit 5 recommandations
- **THEN** 2 sont affichées librement et une section paywall indique "3 opportunités supplémentaires verrouillées"

#### Scenario: Pas de paywall si 2 recommandations ou moins
- **WHEN** le matching produit 0, 1 ou 2 recommandations
- **THEN** aucune section paywall n'est affichée

### Requirement: Aperçu verrouillé des recommandations cachées
La section paywall SHALL afficher des cartes floues ou masquées pour les recommandations verrouillées (titre visible mais contenu masqué), afin de matérialiser la valeur derrière le paywall.

#### Scenario: Cartes verrouillées visibles
- **WHEN** des recommandations sont verrouillées
- **THEN** leurs titres sont visibles mais leurs détails sont masqués par un overlay

### Requirement: CTA vers le paiement
Le bouton principal du paywall SHALL naviguer vers `/payment`. Le prix SHALL être affiché en FCFA. La section SHALL inclure un élément de réassurance (ex. : "Accès immédiat et sécurisé").

#### Scenario: CTA cliquable
- **WHEN** l'utilisateur clique sur le bouton de paiement
- **THEN** il est redirigé vers `/payment`

#### Scenario: Prix affiché sans ambiguïté
- **WHEN** la section paywall est affichée
- **THEN** le prix en FCFA est lisible et le CTA est l'élément le plus proéminent de la section
