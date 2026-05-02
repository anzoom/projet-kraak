## ADDED Requirements

### Requirement: Vérification de la signature HMAC du webhook CinetPay
L'endpoint `POST /api/webhooks/cinetpay` SHALL vérifier la signature HMAC de chaque requête entrante en utilisant `CINETPAY_WEBHOOK_SECRET`. Toute requête avec une signature invalide ou absente SHALL être rejetée avec un statut 401.

#### Scenario: Webhook valide accepté
- **WHEN** CinetPay envoie un webhook avec une signature HMAC valide
- **THEN** l'endpoint traite la notification et retourne 200

#### Scenario: Webhook avec signature invalide rejeté
- **WHEN** une requête arrive sur `/api/webhooks/cinetpay` avec une signature incorrecte ou absente
- **THEN** l'endpoint retourne 401 sans traiter le payload

### Requirement: Idempotence du webhook par psp_transaction_id
L'endpoint SHALL vérifier si le `psp_transaction_id` a déjà été traité avec statut SUCCESS. Si oui, il SHALL retourner 200 immédiatement sans retraiter. Ceci garantit qu'un doublon webhook ne crée pas deux PurchaseAccess.

#### Scenario: Webhook déjà traité ignoré
- **WHEN** CinetPay envoie un webhook pour un `psp_transaction_id` déjà traité en SUCCESS
- **THEN** l'endpoint retourne 200 sans modifier la base de données

#### Scenario: Premier traitement d'un psp_transaction_id
- **WHEN** le `psp_transaction_id` est nouveau
- **THEN** le traitement normal se poursuit

### Requirement: Création du PurchaseAccess après paiement réussi
Lorsque le webhook indique un paiement SUCCESS, l'endpoint SHALL dans une transaction atomique : mettre à jour le `Payment` en status SUCCESS, créer un `PurchaseAccess` avec `expires_at = now() + 6 mois`.

#### Scenario: PurchaseAccess créé après paiement SUCCESS
- **WHEN** le webhook indique `status: "SUCCESS"` pour un paiement PENDING existant
- **THEN** le Payment passe en SUCCESS et un PurchaseAccess est créé avec expires_at dans 6 mois

#### Scenario: Paiement échoué — aucun accès accordé
- **WHEN** le webhook indique `status: "FAILED"` ou `status: "CANCELLED"`
- **THEN** le Payment passe au statut correspondant et aucun PurchaseAccess n'est créé

#### Scenario: Transaction atomique — rollback si erreur
- **WHEN** la création du PurchaseAccess échoue après la mise à jour du Payment
- **THEN** les deux opérations sont annulées et l'état PENDING est conservé
