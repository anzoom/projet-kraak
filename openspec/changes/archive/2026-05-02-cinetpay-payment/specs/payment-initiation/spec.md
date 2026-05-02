## ADDED Requirements

### Requirement: Page de paiement /payment
La page `/payment` SHALL être accessible uniquement aux utilisateurs authentifiés. Elle SHALL afficher le nombre de recommandations verrouillées, le prix en XOF, les modes de paiement disponibles (Orange Money, MTN MoMo, Wave), et un bouton "Payer maintenant". Si aucun `score_id` n'est présent en query param, la page SHALL rediriger vers `/test`.

#### Scenario: Page de paiement affichée avec score_id valide
- **WHEN** un utilisateur authentifié accède à `/payment?score_id=xxx` avec un score_id lui appartenant
- **THEN** la page affiche le récapitulatif du paiement avec le prix en XOF et le bouton "Payer maintenant"

#### Scenario: Redirection si score_id absent
- **WHEN** un utilisateur accède à `/payment` sans paramètre `score_id`
- **THEN** il est redirigé vers `/test` avec un message "Commence par faire le test"

#### Scenario: Redirection si non authentifié
- **WHEN** un utilisateur non authentifié accède à `/payment`
- **THEN** le middleware le redirige vers `/auth/login?next=/payment`

### Requirement: Initiation du paiement CinetPay
L'endpoint `POST /api/payment/initiate` SHALL extraire l'`user_id` du JWT Supabase serveur, créer un enregistrement `Payment(PENDING)` en base, appeler l'API CinetPay pour obtenir une `payment_url`, et retourner cette URL au client. Le montant SHALL être défini côté serveur uniquement (`PAYMENT_AMOUNT_XOF` ou 2 000 XOF par défaut).

#### Scenario: Initiation réussie
- **WHEN** un utilisateur authentifié POST à `/api/payment/initiate` avec un `score_id` valide
- **THEN** un `Payment(PENDING)` est créé en base, et une `payment_url` CinetPay est retournée avec statut 200

#### Scenario: user_id jamais lu depuis le body
- **WHEN** le body de la requête contient un `user_id` différent de celui du JWT
- **THEN** l'`user_id` du JWT est utilisé — le body est ignoré pour ce champ (protection IDOR)

#### Scenario: score_id n'appartenant pas à l'utilisateur
- **WHEN** le `score_id` fourni appartient à un autre utilisateur
- **THEN** l'endpoint retourne 403 Forbidden sans créer de Payment

#### Scenario: Erreur API CinetPay
- **WHEN** l'API CinetPay retourne une erreur
- **THEN** le Payment PENDING est supprimé et l'endpoint retourne 502 avec un message d'erreur
