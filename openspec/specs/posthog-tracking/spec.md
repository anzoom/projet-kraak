### Requirement: Initialisation PostHog via PostHogProvider
Le composant `PostHogProvider.tsx` SHALL initialiser PostHog au démarrage de l'application via `posthog.init(NEXT_PUBLIC_POSTHOG_KEY, { api_host: NEXT_PUBLIC_POSTHOG_HOST })`. Il est wrappé autour du contenu dans `src/app/(app)/layout.tsx`.

#### Scenario: PostHog initialisé au démarrage
- **WHEN** l'application se charge dans le navigateur
- **THEN** PostHog est initialisé avec la clé publique et l'hôte configurés via les variables d'environnement

#### Scenario: Variables d'environnement manquantes en développement
- **WHEN** `NEXT_PUBLIC_POSTHOG_KEY` est vide ou absent
- **THEN** PostHog ne capture aucun événement sans erreur bloquante (dégradation silencieuse)

### Requirement: Événements de parcours test
Les étapes clés du test de profil SHALL déclencher des événements PostHog.

#### Scenario: test_started
- **WHEN** l'utilisateur affiche la première question du test (`TestStepper` — step 0)
- **THEN** l'événement `test_started` est capturé

#### Scenario: test_completed
- **WHEN** l'utilisateur soumet la dernière question du test
- **THEN** l'événement `test_completed` est capturé

### Requirement: Événements de consultation des résultats
La consultation et l'interaction avec les résultats SHALL déclencher des événements PostHog.

#### Scenario: results_viewed
- **WHEN** `ResultsClient` calcule et affiche les recommandations
- **THEN** l'événement `results_viewed` est capturé avec les propriétés `recommendations_count`, `segment`, `global_score` et `quota_exhausted`

#### Scenario: opportunity_clicked
- **WHEN** l'utilisateur clique "Voir les détails" sur une `RecommendationCard`
- **THEN** l'événement `opportunity_clicked` est capturé avec les propriétés `opportunity_id`, `opportunity_title`, `badge`

#### Scenario: opportunity_source_clicked
- **WHEN** l'utilisateur clique "Postuler sur le site officiel" dans `OpportunityDetailModal`
- **THEN** l'événement `opportunity_source_clicked` est capturé

### Requirement: Événements de collecte d'intérêt bêta
Les interactions avec les formulaires de collecte d'email bêta (`BetaServicesTeaser`) SHALL déclencher des événements PostHog.

#### Scenario: beta_service_interest
- **WHEN** l'utilisateur soumet son email dans une carte BetaServicesTeaser (Visa ou Voyage)
- **THEN** l'événement `beta_service_interest` est capturé avec la propriété `source` (`"beta_teaser_visa"` ou `"beta_teaser_voyage"`)

### Requirement: Événements de coaching
Les interactions avec le module de coaching SHALL déclencher des événements PostHog.

#### Scenario: coaching_cta_clicked
- **WHEN** l'utilisateur clique sur un CTA du composant `CoachingUpsell`
- **THEN** l'événement `coaching_cta_clicked` est capturé

#### Scenario: coaching_offer_selected
- **WHEN** l'utilisateur clique "Choisir cette offre" sur la page `/coaching`
- **THEN** l'événement `coaching_offer_selected` est capturé avec la propriété `offer` (id de l'offre)

#### Scenario: coaching_slot_booked
- **WHEN** la réservation d'un créneau est confirmée avec succès
- **THEN** l'événement `coaching_slot_booked` est capturé avec les propriétés `day`, `slot`, `offer`
