### Requirement: Accès libre et intégral aux résultats
Tous les utilisateurs ayant complété le test de profil SHALL avoir accès à l'intégralité de leurs résultats sans paiement ni abonnement. Le modèle freemium avec paywall a été abandonné. La monétisation est assurée uniquement par les offres de coaching.

#### Scenario: Résultats affichés sans restriction
- **WHEN** un utilisateur navigue vers `/results` après avoir complété le test
- **THEN** toutes les recommandations sont affichées sans aucun composant de paywall ni invitation au paiement

#### Scenario: Aucune vérification PurchaseAccess requise
- **WHEN** la page des résultats se charge
- **THEN** aucune requête vers la table `purchase_accesses` n'est effectuée pour déterminer l'accès

### Requirement: Quota de recommandations (maximum, pas fixe)
Le système SHALL afficher **jusqu'à 5** recommandations pour les utilisateurs Classic, et **jusqu'à 20** pour les abonnés Guide Premium. Le quota est un plafond — si le matching retourne moins d'opportunités, seules les disponibles sont affichées. Aucune révélation progressive : toutes les recommandations du quota sont affichées directement.

#### Scenario: Quota Classic atteint — jusqu'à 5 opportunités
- **WHEN** le matching retourne plus de 5 opportunités actives et l'utilisateur n'a pas d'accès Guide Premium
- **THEN** les IDs des 5 premières (score décroissant) sont verrouillés dans le quota et affichées

#### Scenario: Quota Classic partiel — moins de 5 résultats
- **WHEN** le matching retourne moins de 5 opportunités actives
- **THEN** seules les opportunités disponibles sont affichées, sans erreur ni message de quota incomplet

#### Scenario: Quota Premium — jusqu'à 20 opportunités
- **WHEN** un utilisateur avec accès Guide Premium consulte ses résultats
- **THEN** jusqu'à 20 opportunités sont affichées directement

#### Scenario: Plafond de sauvegarde Premium
- **WHEN** un utilisateur Guide Premium sauvegarde des opportunités
- **THEN** la limite est fixée à 15 favoris (inférieure au quota de 20 pour limiter l'exposition de la base)

### Requirement: Verrouillage du quota par IDs d'opportunités
Une fois le quota initial fixé, les identifiants des `maxResults` premières recommandations SHALL être persistés en `localStorage` (clé : `kraak_free_quota_ids`). Modifier les critères du test ne débloque PAS un nouveau jeu d'opportunités — le quota est définitif par session navigateur.

#### Scenario: Quota fixé à la première consultation
- **WHEN** un utilisateur consulte `/results` pour la première fois (`kraak_free_quota_ids` absent)
- **THEN** les IDs des opportunités affichées sont enregistrés dans `kraak_free_quota_ids`

#### Scenario: Tentative de contournement par changement de critères
- **WHEN** un utilisateur modifie ses réponses au test pour obtenir de nouvelles recommandations après avoir déjà vu son quota
- **THEN** les recommandations affichées restent celles du quota initial, `quotaExhausted` est `true`, et un message d'alerte est affiché

#### Scenario: Pas de verrouillage pour les abonnés Guide Premium
- **WHEN** un utilisateur Guide Premium consulte ses résultats
- **THEN** `kraak_free_quota_ids` n'est pas utilisé : les recommandations sont recalculées librement

### Requirement: CoachingUpsell affiché après les résultats
Le composant `CoachingUpsell` SHALL être affiché systématiquement après la liste des recommandations sur la page des résultats. Il propose deux CTA pointant vers les offres de coaching : "Audit de dossier" et "Accompagnement complet".

#### Scenario: CoachingUpsell visible pour tous les utilisateurs
- **WHEN** la page des résultats est affichée
- **THEN** le bloc CoachingUpsell est visible après les cartes de recommandations, quel que soit le profil de l'utilisateur

#### Scenario: CTA coaching capturé par PostHog
- **WHEN** l'utilisateur clique sur un CTA du CoachingUpsell
- **THEN** l'événement `coaching_cta_clicked` est capturé dans PostHog

### Requirement: Collecte d'intérêt bêta après les recommandations
La page des résultats SHALL afficher le composant `BetaCapture` après la liste de recommandations pour collecter les emails des utilisateurs intéressés par les services à venir (Guide KRAAK, Coaching, Aide visa, Voyage). Le composant présente 4 chips de sélection d'intérêt sur une seule ligne et un formulaire email.

#### Scenario: BetaCapture visible pour tous les utilisateurs authentifiés
- **WHEN** un utilisateur authentifié consulte ses résultats (hors mode favoris)
- **THEN** le composant BetaCapture est affiché après les recommandations avec `source="results"`

### Requirement: Modèle paywall abandonné (historique)
> **Note :** Cette spec remplace `results-paywall`. Le modèle freemium (paywall après N résultats → paiement CinetPay → accès complet) a été abandonné le 21 avril 2026 au profit d'un accès gratuit aux résultats et d'une monétisation par le coaching. Le composant `PaywallSection.tsx` est conservé dans le code pour le parcours non authentifié (invitation à créer un compte), mais n'intervient plus dans la limitation d'accès aux résultats.
