### Requirement: Page /dashboard protégée par authentification
La page `/dashboard` SHALL être un Server Component qui vérifie la session Supabase au rendu. Si l'utilisateur n'est pas authentifié, il SHALL être redirigé vers `/auth/login`. Le middleware `src/proxy.ts` assure également la protection au niveau edge (redirect avant rendu).

#### Scenario: Accès non authentifié redirigé
- **WHEN** un utilisateur non connecté navigue vers `/dashboard`
- **THEN** il est redirigé vers `/auth/login`

#### Scenario: Accès authentifié affiche le profil
- **WHEN** un utilisateur authentifié navigue vers `/dashboard`
- **THEN** la page affiche le composant `ProfileClient` avec l'email de l'utilisateur

### Requirement: Affichage du compte et des informations de profil
La section "Mon compte" SHALL afficher l'email de l'utilisateur connecté et un toggle d'activation des alertes email.

#### Scenario: Email affiché
- **WHEN** le dashboard est chargé
- **THEN** l'email de l'utilisateur est visible dans la section "Mon compte"

#### Scenario: État initial du toggle alertes
- **WHEN** le dashboard se charge
- **THEN** le toggle "Alertes email" reflète la valeur `alerts_enabled` retournée par `GET /api/user/alerts`

### Requirement: Toggle des alertes email
Le toggle des alertes SHALL appeler `POST /api/user/alerts` avec `{ enabled: boolean }` et mettre à jour l'état local en fonction de la réponse serveur. L'`user_id` est extrait du JWT côté serveur — jamais du body de la requête.

#### Scenario: Activation des alertes
- **WHEN** l'utilisateur active le toggle
- **THEN** `POST /api/user/alerts` est appelé avec `{ enabled: true }`, la réponse met à jour l'état local

#### Scenario: Désactivation des alertes
- **WHEN** l'utilisateur désactive le toggle
- **THEN** `POST /api/user/alerts` est appelé avec `{ enabled: false }`, la réponse met à jour l'état local

#### Scenario: Toggle désactivé pendant la sauvegarde
- **WHEN** la requête `POST /api/user/alerts` est en cours
- **THEN** le toggle est désactivé visuellement (opacity-50)

### Requirement: Affichage des réponses du test de profil
La section "Mon profil de test" SHALL afficher les réponses au test de profil lues depuis `localStorage` (clé `kraak_anonymous_session`). Si aucune réponse n'est trouvée, un CTA vers `/test` est affiché.

#### Scenario: Réponses du test affichées
- **WHEN** `localStorage` contient des réponses de test
- **THEN** chaque question est affichée avec sa réponse sous forme de libellé lisible

#### Scenario: Aucun test complété
- **WHEN** `localStorage` ne contient pas de réponses de test
- **THEN** le message "Tu n'as pas encore complété le test de profil" et un bouton "Faire le test" sont affichés

### Requirement: Actions rapides depuis le dashboard
La section "Actions" SHALL proposer : voir les résultats (`/results`), refaire le test (`/test`), changer le mot de passe (`/auth/update-password`).

#### Scenario: Liens d'action navigables
- **WHEN** l'utilisateur clique sur "Voir mes résultats"
- **THEN** il est redirigé vers `/results`

### Requirement: Déconnexion depuis le dashboard
Le bouton "Se déconnecter" SHALL appeler `supabase.auth.signOut()` puis rediriger vers `/`.

#### Scenario: Déconnexion réussie
- **WHEN** l'utilisateur clique "Se déconnecter"
- **THEN** la session Supabase est terminée et l'utilisateur est redirigé vers `/`

#### Scenario: Bouton désactivé pendant la déconnexion
- **WHEN** la déconnexion est en cours
- **THEN** le bouton affiche "Déconnexion…" et est désactivé
