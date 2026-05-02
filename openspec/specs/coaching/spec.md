### Requirement: Page de coaching affichant 4 offres organisées en 2 sections
La page `/coaching` SHALL afficher 4 offres organisées en deux sections : "Conseil individuel" (Audit de dossier + Accompagnement complet) et "Services pratiques" (Aide démarches visa + Voyage & Hébergement). Chaque offre inclut une icône, un titre, un prix ou statut, une description et une liste de fonctionnalités.

#### Scenario: Affichage des 4 offres en 2 sections
- **WHEN** l'utilisateur navigue vers `/coaching`
- **THEN** les sections "Conseil individuel" et "Services pratiques" sont affichées, chacune avec leurs offres respectives

#### Scenario: Offre Accompagnement complet mise en avant
- **WHEN** la page est affichée
- **THEN** l'offre "Accompagnement complet" porte le badge "Le plus populaire" et une bordure primaire

#### Scenario: Navigation depuis les résultats
- **WHEN** l'utilisateur arrive depuis `/results` via un lien CoachingUpsell
- **THEN** un lien "Retour aux résultats" est visible en en-tête

#### Scenario: Ancre automatique vers l'offre sélectionnée
- **WHEN** l'URL contient le hash `#audit`, `#accompagnement`, `#visa` ou `#voyage`
- **THEN** la page scrolle automatiquement vers l'offre correspondante

### Requirement: Offre "Aide démarches visa"
La page `/coaching` SHALL afficher une offre "Aide démarches visa" dans la section "Services pratiques", ciblant les étudiants confrontés aux refus de visa. L'offre SHALL inclure : une description centrée sur la problématique de refus, et 4 prestations (checklist par pays de destination, modèles de lettre de motivation consulaire, stratégie anti-refus, conseils sur les délais et calendrier).

#### Scenario: Offre visa affichée avec ses prestations
- **WHEN** l'utilisateur consulte la section "Services pratiques"
- **THEN** l'offre "Aide démarches visa" est visible avec ses 4 prestations listées

#### Scenario: Ancre `#visa` fonctionnelle
- **WHEN** l'URL contient `#visa`
- **THEN** la page scrolle vers la section de l'offre Visa

### Requirement: Offre "Voyage & Hébergement"
La page `/coaching` SHALL afficher une offre "Voyage & Hébergement" dans la section "Services pratiques", ciblant les étudiants ayant obtenu une bourse ou admission mais confrontés à la logistique de départ. L'offre SHALL inclure 4 prestations : guide des billets d'avion réduits (partenaires, périodes), options d'hébergement à l'arrivée, checklist d'installation, et budget de référence par pays de destination.

#### Scenario: Offre voyage affichée avec ses prestations
- **WHEN** l'utilisateur consulte la section "Services pratiques"
- **THEN** l'offre "Voyage & Hébergement" est visible avec ses 4 prestations listées

#### Scenario: Ancre `#voyage` fonctionnelle
- **WHEN** l'URL contient `#voyage`
- **THEN** la page scrolle vers la section de l'offre Voyage

### Requirement: Calendrier de réservation de créneaux
Chaque offre SHALL afficher un calendrier permettant de sélectionner un jour puis un créneau horaire. Les créneaux durent 45 minutes, de 11h00 à 16h00, les jours ouvrés (hors dimanche), sur les 12 prochains jours.

#### Scenario: Sélection d'un jour
- **WHEN** l'utilisateur clique sur un jour disponible dans le calendrier
- **THEN** le jour est sélectionné (visuellement mis en avant) et les créneaux horaires de ce jour sont affichés

#### Scenario: Navigation hebdomadaire dans le calendrier
- **WHEN** l'utilisateur clique sur les chevrons de navigation
- **THEN** les jours suivants ou précédents sont affichés (fenêtre de 6 jours)

#### Scenario: Créneaux déjà réservés
- **WHEN** un créneau est déjà réservé (retourné par `GET /api/coaching/slots`)
- **THEN** le créneau est affiché barré, grisé et non cliquable

#### Scenario: Confirmation de la sélection
- **WHEN** l'utilisateur a sélectionné un jour et un créneau
- **THEN** un récapitulatif affiche le créneau choisi et le bouton "Confirmer sur WhatsApp →" devient actif

### Requirement: Réservation via WhatsApp
La confirmation d'un créneau SHALL appeler `POST /api/coaching/book` puis ouvrir WhatsApp avec un message pré-rempli incluant l'offre choisie, le jour et l'heure.

#### Scenario: Réservation réussie
- **WHEN** l'utilisateur clique "Confirmer sur WhatsApp →"
- **THEN** `POST /api/coaching/book` est appelé, l'événement `coaching_slot_booked` est capturé dans PostHog, et WhatsApp s'ouvre avec le message de réservation pré-rempli

#### Scenario: Créneau pris entre temps (conflit)
- **WHEN** `POST /api/coaching/book` retourne 409
- **THEN** le créneau est marqué indisponible, la sélection est réinitialisée, aucun message d'erreur bloquant n'est affiché

#### Scenario: Confirmation affichée après réservation
- **WHEN** la réservation est confirmée avec succès
- **THEN** un encadré vert "✅ Créneau réservé !" s'affiche avec la mention que le conseiller contactera l'utilisateur

### Requirement: API GET /api/coaching/slots
L'endpoint `GET /api/coaching/slots` SHALL retourner la liste des réservations existantes (date, créneau, statut) pour permettre l'affichage des créneaux indisponibles côté client. Aucune authentification requise.

#### Scenario: Récupération des créneaux réservés
- **WHEN** le client appelle `GET /api/coaching/slots`
- **THEN** la réponse JSON contient `{ bookings: [{ date, slot, status }] }` pour toutes les réservations PENDING et CONFIRMED

### Requirement: API POST /api/coaching/book
L'endpoint `POST /api/coaching/book` SHALL créer une réservation avec les champs `date` et `slot`. Si ce créneau est déjà pris, il SHALL retourner 409.

#### Scenario: Création d'une réservation
- **WHEN** le body contient `{ date: "2026-05-10", slot: "11:00" }`
- **THEN** la réservation est créée en base et le statut 200 est retourné

#### Scenario: Créneau déjà réservé
- **WHEN** le body contient un date+slot déjà présent en base
- **THEN** le statut 409 est retourné sans créer de doublon

### Requirement: CoachingUpsell dans les résultats
Le composant `CoachingUpsell.tsx` SHALL être affiché dans la page des résultats après les recommandations, proposant deux CTA : "Audit de dossier" (→ `/coaching#audit`) et "Accompagnement complet" (→ `/coaching#accompagnement`).

#### Scenario: Affichage du bloc upsell
- **WHEN** la page des résultats est affichée
- **THEN** le bloc CoachingUpsell est visible après la liste des recommandations

#### Scenario: CTA de l'upsell naviguent vers la bonne offre
- **WHEN** l'utilisateur clique sur "Audit de dossier"
- **THEN** il est redirigé vers `/coaching#audit` et le calendrier de cette offre s'ouvre automatiquement
