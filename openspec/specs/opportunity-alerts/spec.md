### Requirement: API GET /api/user/alerts — lecture des préférences d'alertes
L'endpoint `GET /api/user/alerts` SHALL retourner l'état `alerts_enabled` de l'utilisateur authentifié. Si l'utilisateur n'a pas encore de ligne dans la table `users` Prisma, elle est créée par upsert. Requiert une session Supabase valide — retourne 401 sinon.

#### Scenario: Récupération pour utilisateur connu
- **WHEN** un utilisateur authentifié appelle `GET /api/user/alerts`
- **THEN** la réponse est `{ alerts_enabled: boolean }` reflétant la valeur en base

#### Scenario: Premier appel — upsert utilisateur
- **WHEN** l'utilisateur n'a pas encore de ligne dans la table `users` Prisma
- **THEN** la ligne est créée automatiquement et `alerts_enabled` est retourné à `false` (valeur par défaut)

#### Scenario: Non authentifié
- **WHEN** l'appel est fait sans session Supabase valide
- **THEN** HTTP 401 est retourné

### Requirement: API POST /api/user/alerts — modification des préférences d'alertes
L'endpoint `POST /api/user/alerts` SHALL mettre à jour le champ `alerts_enabled` pour l'utilisateur authentifié. Le body JSON doit contenir `{ enabled: boolean }`. L'`user_id` est extrait du JWT côté serveur — jamais du body de la requête.

#### Scenario: Activation des alertes
- **WHEN** le body est `{ enabled: true }`
- **THEN** `alerts_enabled` est mis à `true` en base et la réponse retourne `{ alerts_enabled: true }`

#### Scenario: Désactivation des alertes
- **WHEN** le body est `{ enabled: false }`
- **THEN** `alerts_enabled` est mis à `false` en base et la réponse retourne `{ alerts_enabled: false }`

#### Scenario: Body invalide
- **WHEN** le body ne contient pas `enabled` en tant que boolean
- **THEN** HTTP 400 est retourné avec un message d'erreur

### Requirement: Cron job hebdomadaire d'envoi d'alertes email
L'endpoint `GET /api/cron/send-alerts` SHALL être déclenché hebdomadairement par Vercel Cron. Il est protégé par un header `Authorization: Bearer CRON_SECRET`. Pour chaque utilisateur ayant `alerts_enabled = true` et au moins une réponse de test, il recalcule les recommandations et envoie un email Resend avec les 3 meilleures opportunités.

#### Scenario: Accès non autorisé
- **WHEN** le header `Authorization` est absent ou incorrect
- **THEN** HTTP 401 est retourné et aucun email n'est envoyé

#### Scenario: Envoi d'alertes pour utilisateurs éligibles
- **WHEN** le cron est déclenché et des utilisateurs ont `alerts_enabled = true` avec un test_response
- **THEN** les recommandations sont recalculées via `matchOpportunities` et un email est envoyé via Resend pour chaque utilisateur éligible

#### Scenario: Utilisateur sans test_response ignoré
- **WHEN** un utilisateur a `alerts_enabled = true` mais aucune réponse de test
- **THEN** il est compté dans `skipped` et aucun email ne lui est envoyé

#### Scenario: Utilisateur sans recommandations ignoré
- **WHEN** `matchOpportunities` retourne 0 résultats pour un utilisateur
- **THEN** il est compté dans `skipped` et aucun email ne lui est envoyé

#### Scenario: Réponse de succès
- **WHEN** le cron se termine normalement
- **THEN** la réponse JSON est `{ sent: N, skipped: M }` indiquant le nombre d'emails envoyés et ignorés

### Requirement: Template email des alertes
L'email envoyé via Resend SHALL présenter les 3 meilleures opportunités avec titre, catégorie, pays, deadline (si présente) et lien source. Il contient un CTA "Voir tous mes résultats" vers `kraak.co/results` et un lien de désinscription vers `/dashboard`.

#### Scenario: Contenu de l'email
- **WHEN** l'email est généré pour un utilisateur avec des recommandations
- **THEN** il contient au maximum 3 opportunités avec leurs détails et un lien de désinscription vers `/dashboard`

#### Scenario: Expéditeur et objet
- **WHEN** l'email est envoyé via Resend
- **THEN** l'expéditeur est `KRAAK <alertes@kraak.co>` et l'objet est "3 opportunités correspondent à ton profil"
