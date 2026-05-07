### Requirement: Règle de visibilité des opportunités expirées
Une opportunité est considérée expirée si sa deadline est antérieure à la date courante. Les opportunités expirées ne sont affichées que si l'horizon de démarrage déclaré par l'utilisateur (`timeline`) est `"moyen"` (≤ 12 mois) ou `"long"` (> 12 mois). Pour les horizons `"urgent"` ou `"court"`, les opportunités expirées sont silencieusement exclues.

#### Scenario: Horizon compatible — opportunités expirées incluses
- **WHEN** `timeline` est `"moyen"` ou `"long"`
- **THEN** les opportunités avec une deadline passée et passant les autres filtres sont incluses dans les résultats, ajoutées après les opportunités actives

#### Scenario: Horizon court — opportunités expirées exclues
- **WHEN** `timeline` est `"urgent"` ou `"court"`
- **THEN** aucune opportunité dont la deadline est passée n'apparaît dans les résultats

#### Scenario: Opportunité sans deadline jamais expirée
- **WHEN** une opportunité a `deadline = null`
- **THEN** elle n'est jamais considérée comme expirée et passe normalement les filtres

### Requirement: Tri et position des opportunités expirées
Les opportunités sont séparées en deux listes avant le tri : actives et expirées. Chaque liste est triée par score décroissant indépendamment. Les résultats finaux sont `[...actives_avec_badges, ...expirées_sans_badge]`.

#### Scenario: Résultats triés — actives d'abord
- **WHEN** le matching retourne des opportunités actives et expirées
- **THEN** toutes les opportunités actives apparaissent avant les opportunités expirées, quels que soient leurs scores respectifs

#### Scenario: Pas de badge sur les opportunités expirées
- **WHEN** une opportunité expirée est dans les résultats
- **THEN** son champ `badge` est `null` (pas de badge "top" ni "probability")

### Requirement: Affichage carte d'opportunité expirée (RecommendationCard)
Une `RecommendationCard` avec `isExpired = true` SHALL afficher un traitement visuel spécifique signalant que la candidature est fermée.

#### Scenario: Badge "édition passée"
- **WHEN** la carte est expirée
- **THEN** le badge "📅 Candidature fermée — surveille la prochaine édition" est affiché à la place du badge de score

#### Scenario: Deadline affichée barrée
- **WHEN** la carte est expirée et a une deadline
- **THEN** la deadline est affichée barrée avec le préfixe "Éd." (ex. "Éd. 15 décembre 2024")

#### Scenario: Opacité réduite et bordure grise
- **WHEN** la carte est expirée
- **THEN** elle s'affiche avec `opacity-80` et une bordure grise au lieu de la bordure primaire

### Requirement: Affichage modal de détail d'opportunité expirée (OpportunityDetailModal)
Le modal ouvert depuis une carte expirée SHALL adapter son contenu pour refléter le statut "édition passée".

#### Scenario: Bannière ambre "Édition passée"
- **WHEN** le modal s'ouvre pour une opportunité expirée
- **THEN** une bannière ambre s'affiche en haut du contenu avec le message "Édition passée. Les candidatures sont actuellement fermées. Suis ce programme pour être informé(e) de la prochaine session."

#### Scenario: Deadline barrée dans les badges
- **WHEN** le modal affiche une opportunité expirée avec deadline
- **THEN** le badge deadline est barré et grisé, préfixé "Éd."

#### Scenario: Étape de soumission remplacée
- **WHEN** les étapes de candidature sont générées pour une opportunité expirée
- **THEN** l'étape 4 (normalement "Soumettre avant le [date]") est remplacée par "Surveille l'ouverture des candidatures pour la prochaine édition et prépare ton dossier en avance."

#### Scenario: CTA adapté
- **WHEN** le modal s'ouvre pour une opportunité expirée
- **THEN** le bouton CTA est grisé et affiche "Voir le programme officiel" (au lieu de "Postuler sur le site officiel")
