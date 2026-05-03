## ADDED Requirements

### Requirement: Email de bienvenue post-inscription

Le système SHALL envoyer un email de bienvenue branded via Resend à chaque nouvel utilisateur, une seule fois, après confirmation de son compte.

L'envoi est conditionné par `welcome_sent = false` sur le modèle `User`. Après envoi réussi, `welcome_sent` est mis à `true`. L'email ne doit jamais être envoyé deux fois au même utilisateur.

#### Scenario: Envoi lors d'une session immédiate

- **WHEN** un utilisateur s'inscrit et obtient une session immédiatement (sans confirmation email)
- **THEN** `POST /api/user/welcome` est appelé depuis `RegisterForm`, l'email de bienvenue est envoyé via Resend et `welcome_sent` est mis à `true`

#### Scenario: Envoi lors d'une session différée (confirmation email)

- **WHEN** un utilisateur confirme son email en cliquant le lien Supabase
- **THEN** le callback `/auth/callback` appelle `POST /api/user/welcome`, l'email est envoyé et `welcome_sent` est mis à `true`

#### Scenario: Idempotence — second appel ignoré

- **WHEN** `POST /api/user/welcome` est appelé pour un utilisateur avec `welcome_sent = true`
- **THEN** l'API retourne `200 { success: true }` sans envoyer d'email ni modifier la DB

#### Scenario: Resend indisponible

- **WHEN** l'appel Resend échoue lors de l'envoi du bienvenu
- **THEN** `welcome_sent` reste `false`, la réponse API est `500`, et la redirection utilisateur n'est pas bloquée (appel fire-and-forget côté client)

---

### Requirement: API POST /api/user/welcome

Le système SHALL exposer `POST /api/user/welcome` pour déclencher l'envoi de l'email de bienvenue.

L'`user_id` MUST être extrait du JWT Supabase côté serveur, jamais du body. L'API SHALL créer l'entrée `User` en DB via `upsert` si elle n'existe pas encore.

Réponses :
- `200 { success: true }` si email envoyé ou déjà envoyé (`welcome_sent = true`)
- `401` si non authentifié
- `500` si erreur Resend ou DB

#### Scenario: Utilisateur non authentifié

- **WHEN** `POST /api/user/welcome` est appelé sans JWT valide
- **THEN** l'API retourne `401`

#### Scenario: Création User si absent

- **WHEN** un utilisateur vient de s'inscrire et n'a pas encore d'entrée dans la table `User`
- **THEN** l'API crée l'entrée via `upsert` avant d'envoyer l'email

---

### Requirement: Champ welcome_sent sur User

Le modèle `User` SHALL inclure un champ `welcome_sent Boolean @default(false)` pour garantir l'idempotence de l'envoi du mail de bienvenue.

#### Scenario: Valeur par défaut à false

- **WHEN** un nouvel enregistrement `User` est créé
- **THEN** `welcome_sent` est `false`

---

### Requirement: Bandeau de bienvenue sur la page test

Le système SHALL afficher un bandeau de bienvenue contextuel sur `/test` lorsque le paramètre `?welcome=1` est présent dans l'URL.

Le bandeau encourage le nouvel utilisateur à compléter le test de profil pour découvrir ses opportunités.

#### Scenario: Affichage du bandeau

- **WHEN** un nouvel utilisateur est redirigé vers `/test?welcome=1`
- **THEN** un message de bienvenue s'affiche en haut de la page test

#### Scenario: Absence du paramètre

- **WHEN** un utilisateur navigue vers `/test` sans `?welcome=1`
- **THEN** aucun bandeau supplémentaire n'est affiché
