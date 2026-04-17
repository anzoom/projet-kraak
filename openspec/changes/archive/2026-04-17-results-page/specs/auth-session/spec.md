## MODIFIED Requirements

### Requirement: Page résultats complète protégée
La page `/results` SHALL être accessible uniquement aux utilisateurs authentifiés. Elle SHALL afficher le profil scoré complet (segment, sous-scores, score global), les recommandations personnalisées avec paywall freemium, et calculer le score à la volée depuis localStorage si absent.

#### Scenario: Résultats complets avec score disponible
- **WHEN** un utilisateur authentifié accède à `/results` et `kraak_scoring_result` contient un score
- **THEN** la page affiche le segment, les sous-scores, les recommandations libres et le paywall si applicable

#### Scenario: Résultats calculés à la volée
- **WHEN** un utilisateur authentifié accède à `/results` et `kraak_scoring_result` est absent mais `kraak_anonymous_session` contient des réponses valides
- **THEN** le score est calculé automatiquement et les résultats sont affichés

#### Scenario: Résultats sans score ni réponses
- **WHEN** un utilisateur authentifié accède à `/results` mais aucun score ni réponse n'est disponible
- **THEN** la page affiche un bouton d'invitation à faire ou refaire le test

#### Scenario: Accès non authentifié à /results
- **WHEN** un utilisateur non connecté tente d'accéder à `/results`
- **THEN** le proxy le redirige vers `/auth/login?next=/results` avant même que la page ne se charge
