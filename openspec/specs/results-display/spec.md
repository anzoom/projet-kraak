### Requirement: Affichage du profil scoré complet
La page `/results` SHALL afficher le segment de l'utilisateur (Explorer, Candidat, Finaliste), les trois sous-scores (académique, financier, maturité) arrondis à l'entier, et le score global sur 100.

#### Scenario: Profil Finaliste affiché
- **WHEN** un utilisateur authentifié a un score de segment `Finaliste` dans localStorage
- **THEN** la page affiche le badge "Finaliste", les trois sous-scores et le score global

#### Scenario: Score calculé à la volée si absent
- **WHEN** `kraak_scoring_result` est absent mais `kraak_anonymous_session` contient des réponses
- **THEN** le score est calculé via `/api/scoring`, stocké en localStorage, et affiché sans action utilisateur

#### Scenario: Invitation à refaire le test si données absentes
- **WHEN** ni `kraak_scoring_result` ni des réponses valides ne sont disponibles
- **THEN** un bouton "Faire le test" est affiché à la place des résultats

### Requirement: Affichage des recommandations libres
La page SHALL afficher les 2 premières `Recommendation[]` (triées par `match_score` décroissant) avec : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, et justification.

#### Scenario: Deux recommandations libres visibles
- **WHEN** le matching produit au moins 2 recommandations
- **THEN** les 2 premières sont affichées complètement sans verrouillage

#### Scenario: Moins de 2 recommandations disponibles
- **WHEN** le matching produit 0 ou 1 recommandation
- **THEN** seules les disponibles sont affichées, sans erreur

#### Scenario: Catalogue vide — message dédié
- **WHEN** aucune opportunité n'est disponible (ni Payload ni seed)
- **THEN** la page affiche un message "Catalogue en cours de construction" sans erreur

### Requirement: Source des opportunités avec fallback seed
Le server component SHALL récupérer les opportunités actives depuis l'API Payload CMS. Si l'appel échoue ou retourne zéro opportunités, il SHALL utiliser les données de `src/data/seed-opportunities.ts`.

#### Scenario: Opportunités chargées depuis Payload CMS
- **WHEN** Payload CMS est disponible et contient des opportunités actives
- **THEN** le matching utilise ces opportunités réelles

#### Scenario: Fallback sur seed si Payload indisponible
- **WHEN** l'appel à l'API Payload CMS échoue (réseau, DB non configurée)
- **THEN** les 10 opportunités de seed sont utilisées pour le matching sans erreur côté utilisateur
