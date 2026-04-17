## ADDED Requirements

### Requirement: Protection JWT des routes sensibles dans le proxy
Le proxy SHALL vérifier le JWT Supabase avant d'autoriser l'accès aux routes protégées (`/results`). Un utilisateur non authentifié MUST être redirigé vers `/auth/login?next=<pathname>`.

#### Scenario: Accès non authentifié à /results
- **WHEN** un utilisateur sans JWT valide tente d'accéder à `/results`
- **THEN** il est redirigé vers `/auth/login?next=/results`

#### Scenario: Accès authentifié à /results
- **WHEN** un utilisateur avec un JWT valide accède à `/results`
- **THEN** la page est retournée normalement

#### Scenario: JWT expiré sur route protégée
- **WHEN** un JWT expiré est présent dans les cookies et l'utilisateur accède à `/results`
- **THEN** il est redirigé vers `/auth/login?next=/results`

### Requirement: Client Supabase SSR pour Server Components
Le système SHALL exposer `createSupabaseServerAnonClient()` pour lire l'utilisateur authentifié dans les Server Components et API Routes, via les cookies HttpOnly.

#### Scenario: Lecture de l'utilisateur côté serveur
- **WHEN** un Server Component appelle `createSupabaseServerAnonClient().auth.getUser()`
- **THEN** il reçoit l'objet `user` si la session est valide, ou `null` sinon

### Requirement: Page résultats stub protégée
La page `/results` SHALL être accessible uniquement aux utilisateurs authentifiés. Elle SHALL afficher le segment de l'utilisateur lu depuis `kraak_scoring_result` dans localStorage, ou un message d'invitation à refaire le test si absent.

#### Scenario: Résultats avec score disponible
- **WHEN** un utilisateur authentifié accède à `/results` et `kraak_scoring_result` contient un score
- **THEN** la page affiche le segment (Explorer, Candidat ou Finaliste) de l'utilisateur

#### Scenario: Résultats sans score
- **WHEN** un utilisateur authentifié accède à `/results` mais `kraak_scoring_result` est absent du localStorage
- **THEN** la page affiche un bouton d'invitation à faire ou refaire le test

#### Scenario: Accès non authentifié à /results
- **WHEN** un utilisateur non connecté tente d'accéder à `/results`
- **THEN** le proxy le redirige vers `/auth/login?next=/results` avant même que la page ne se charge
