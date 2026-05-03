### Requirement: Affichage du profil scoré complet
La page `/results` SHALL afficher le segment de l'utilisateur (Explorer, Candidat, Finaliste), les trois sous-scores (académique, financier, maturité) arrondis à l'entier, et le score global sur 100.

#### Scenario: Profil Finaliste affiché
- **WHEN** un utilisateur authentifié a un score de segment `Finaliste` dans localStorage
- **THEN** la page affiche le badge "Finaliste", les trois sous-scores et le score global

#### Scenario: Score calculé à la volée si absent
- **WHEN** `kraak_scoring_result` est absent mais `kraak_anonymous_session` contient des réponses
- **THEN** le score est calculé via `/api/scoring`, stocké en localStorage, et affiché sans action utilisateur

#### Scenario: Invitation à refaire le test si données absentes
- **WHEN** ni `kraak_scoring_result` ni des réponses valides ne sont disponibles
- **THEN** un bouton "Faire le test" est affiché à la place des résultats

### Requirement: Affichage des recommandations libres
La page SHALL afficher jusqu'à `maxResults` (5 par défaut pour Classic, 20 pour les abonnés Guide Premium) `Recommendation[]` (triées par `match_score` décroissant) avec : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, justification, description courte (si disponible), et un lien de candidature (si `source_url` défini). Toutes les recommandations du quota sont affichées directement, sans révélation progressive.

#### Scenario: Recommandations visibles dans la limite du quota
- **WHEN** le matching produit des recommandations et un utilisateur authentifié consulte `/results`
- **THEN** jusqu'à 5 recommandations sont affichées (ou jusqu'à 20 si l'utilisateur a un accès Guide Premium)

#### Scenario: Moins de recommandations que le quota
- **WHEN** le matching produit moins de résultats que `maxResults`
- **THEN** seules les disponibles sont affichées, sans erreur

#### Scenario: Aucune opportunité correspondant au profil
- **WHEN** le matching ne retourne aucune recommandation pour le profil de l'utilisateur
- **THEN** la page affiche un message "Aucune opportunité trouvée pour ce profil" expliquant que le catalogue ne couvre pas encore ces critères, accompagné du bloc coconstruction (voir requirement dédié), sans erreur

#### Scenario: Description courte affichée dans la card
- **WHEN** une recommandation a un champ `short_description` non nul
- **THEN** ce texte est affiché sous le titre de l'opportunité dans la card

#### Scenario: Bouton Voir les détails affiché sur la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** un bouton "Voir les détails" est affiché sur la card, ouvrant la modale de détail

#### Scenario: Bouton Postuler absent de la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** aucun bouton "Postuler" n'est affiché directement sur la card

### Requirement: Bloc coconstruction — empty state
Quand le matching ne retourne aucune recommandation, la page SHALL afficher un bloc coconstruction invitant l'utilisateur à signaler une opportunité hors catalogue. Le bloc SHALL contenir : un message expliquant l'absence de résultat sans blâmer l'utilisateur, une explication de la démarche collaborative, et un lien `mailto:` pré-rempli (sujet + template de contribution structuré : titre, lien officiel, type, niveau, zone).

#### Scenario: Bloc coconstruction affiché en empty state
- **WHEN** le matching retourne zéro recommandation pour un utilisateur authentifié
- **THEN** le bloc coconstruction est affiché sous le message d'absence de résultat, avec le lien "Suggérer une opportunité →"

#### Scenario: Lien mailto pré-rempli
- **WHEN** l'utilisateur clique sur "Suggérer une opportunité →" depuis le bloc coconstruction
- **THEN** son client mail s'ouvre avec le sujet "Opportunité à ajouter au catalogue" et un corps structuré (titre, lien officiel, type, niveau, zone géographique)

### Requirement: Bloc coconstruction — bas de liste
Pour tout utilisateur authentifié ayant reçu des recommandations, la page SHALL afficher un bloc coconstruction compact en bas de la liste, après toutes les cartes et modules upsell. Le bloc SHALL inviter l'utilisateur à partager des opportunités qu'il aurait identifiées hors catalogue, avec le même lien `mailto:` pré-rempli.

#### Scenario: Bloc coconstruction visible en bas de liste
- **WHEN** un utilisateur authentifié consulte ses recommandations (hors mode favoris)
- **THEN** un bloc compact `🤝` est affiché en bas de page avec le texte "Tu as repéré une opportunité qu'on n'a pas encore ?" et le lien "Suggérer une opportunité →"

#### Scenario: Bloc absent en mode favoris
- **WHEN** l'utilisateur consulte ses favoris (`showFavorites = true`)
- **THEN** le bloc coconstruction bas de liste n'est pas affiché

### Requirement: Modale de détail d'une opportunité
La page SHALL afficher une modale (bottom sheet) quand l'utilisateur clique sur "Voir les détails". La modale SHALL contenir : badges (catégorie, pays), section Présentation (description complète), section Conditions d'éligibilité (deadline, budget, niveau d'études, domaine), section Démarche de candidature (étapes propres à chaque catégorie), et un bouton CTA "Postuler sur le site officiel" (si `source_url` défini).

#### Scenario: Modale affichée au clic sur Voir les détails
- **WHEN** l'utilisateur clique sur "Voir les détails" pour une opportunité
- **THEN** la modale s'ouvre avec les informations complètes de l'opportunité

#### Scenario: Modale fermée au clic sur la croix ou le backdrop
- **WHEN** l'utilisateur clique sur le bouton × ou en dehors de la modale
- **THEN** la modale se ferme sans modification de la page

#### Scenario: Modale fermée à l'appui sur Échap
- **WHEN** la modale est ouverte et l'utilisateur appuie sur la touche Échap
- **THEN** la modale se ferme

#### Scenario: Défilement du body bloqué à l'ouverture
- **WHEN** la modale est ouverte
- **THEN** le défilement de la page principale est bloqué (`overflow: hidden`)

#### Scenario: Bouton Postuler dans la modale si source_url présent
- **WHEN** une recommandation a un champ `source_url` non nul et la modale est ouverte
- **THEN** le bouton "Postuler sur le site officiel" est affiché en pied de modale et ouvre l'URL en nouvel onglet

#### Scenario: Badge location affiché si renseigné
- **WHEN** une opportunité a un champ `location` non nul et la modale est ouverte
- **THEN** un badge `📍 <location>` est affiché dans la zone des badges métadonnées (financement, deadline, budget)

#### Scenario: Badge location absent si non renseigné
- **WHEN** une opportunité n'a pas de champ `location` et la modale est ouverte
- **THEN** aucun badge lieu n'est affiché, sans erreur

#### Scenario: Bouton Postuler absent de la modale si source_url manquant
- **WHEN** une recommandation n'a pas de `source_url` et la modale est ouverte
- **THEN** aucun bouton de candidature n'est affiché dans la modale, sans erreur

### Requirement: Bouton "Réserver un coaching" toujours affiché dans la modale
La modale de détail SHALL toujours afficher un bouton "Réserver un coaching / suivi" dans le pied de modale, même si aucun `source_url` n'est disponible.

#### Scenario: Bouton coaching affiché avec source_url présent
- **WHEN** une opportunité a un `source_url` et la modale est ouverte
- **THEN** le pied de modale affiche deux boutons : "Postuler sur le site officiel" (primaire) et "Réserver un coaching / suivi" (secondaire outline)

#### Scenario: Bouton coaching affiché sans source_url
- **WHEN** une opportunité n'a pas de `source_url` et la modale est ouverte
- **THEN** le pied de modale affiche uniquement le bouton "Réserver un coaching / suivi" (secondaire outline), sans erreur

#### Scenario: Lien coaching redirige vers /coaching
- **WHEN** l'utilisateur clique sur "Réserver un coaching / suivi"
- **THEN** il est redirigé vers la page `/coaching`

#### Scenario: Étapes de candidature selon catégorie
- **WHEN** la modale est ouverte pour une opportunité
- **THEN** la section Démarche de candidature affiche les étapes adaptées à la catégorie de l'opportunité (bourse, formation, programme, emploi, stage)

### Requirement: CoachingUpsell interstitiel après la 3ème recommandation
Le composant `CoachingUpsell` SHALL être affiché comme interstitiel après la 3ème carte de recommandation dans la liste (index 2), en dehors du mode favoris.

#### Scenario: CoachingUpsell inséré après la 3ème carte
- **WHEN** la page des résultats affiche au moins 3 recommandations
- **THEN** le composant CoachingUpsell est rendu entre la 3ème et la 4ème carte de recommandation

#### Scenario: CoachingUpsell absent en mode favoris
- **WHEN** l'utilisateur consulte ses favoris (`showFavorites = true`)
- **THEN** le CoachingUpsell interstitiel n'est pas affiché

### Requirement: Quota de résultats verrouillé par identifiants d'opportunités
Lors de la première consultation, les identifiants des `maxResults` premières opportunités retournées SHALL être fixés dans `localStorage` (clé : `kraak_free_quota_ids`). Les consultations ultérieures, même après modification des critères, SHALL toujours afficher les opportunités du quota initial.

#### Scenario: Première consultation — quota fixé
- **WHEN** un utilisateur consulte `/results` pour la première fois (quota absent en localStorage)
- **THEN** les IDs des recommandations affichées sont sauvegardés dans `kraak_free_quota_ids`

#### Scenario: Consultation ultérieure — quota respecté
- **WHEN** `kraak_free_quota_ids` contient des IDs et l'utilisateur consulte ses résultats
- **THEN** les recommandations affichées correspondent aux opportunités du quota initial, même si les critères ont changé

#### Scenario: Alerte quota épuisé affiché
- **WHEN** les critères modifiés par l'utilisateur produiraient un nouveau jeu d'opportunités (`quotaExhausted = true`)
- **THEN** un bloc d'alerte amber est affiché avec le message "Quota gratuit atteint (jusqu'à 5 opportunités)" et un CTA vers `/guide-premium`

#### Scenario: Quota absent pour les abonnés Guide Premium
- **WHEN** un utilisateur Guide Premium consulte ses résultats (`maxResults = 20`)
- **THEN** les recommandations sont recalculées à chaque consultation sans verrouillage par quota

### Requirement: Collecte d'intérêt bêta — BetaCapture
La page SHALL afficher le composant `BetaCapture` après la liste des recommandations. Le composant présente 4 chips de sélection d'intérêt (Guide KRAAK, Coaching, Aide visa, Voyage) sur une seule ligne, un champ email et un bouton de soumission.

#### Scenario: BetaCapture visible après les recommandations
- **WHEN** un utilisateur authentifié consulte ses résultats (hors mode favoris)
- **THEN** le composant `BetaCapture` est affiché avec `source="results"` après la liste des recommandations

#### Scenario: Soumission d'intérêt multi-services
- **WHEN** l'utilisateur sélectionne des chips, saisit son email et clique sur "Me prévenir →"
- **THEN** un appel `POST /api/guide-premium/waitlist` est effectué avec `{ email, source: "results", interest: "<chips sélectionnés>" }` et l'événement `waitlist_signup` est capturé dans PostHog

#### Scenario: Confirmation après soumission
- **WHEN** la soumission réussit
- **THEN** le composant affiche un message de confirmation "C'est noté !"

#### Scenario: BetaCapture absent en mode favoris
- **WHEN** l'utilisateur consulte ses favoris (`showFavorites = true`)
- **THEN** le composant BetaCapture n'est pas affiché

### Requirement: Ordre d'affichage des modules après les recommandations
Après la liste des cartes de recommandations, les modules SHALL être affichés dans l'ordre suivant : (1) bouton révélation progressive (si opportunités restantes), (2) alerte quota épuisé (si applicable), (3) BetaCapture, (4) PaywallSection (si utilisateur non authentifié), (5) bloc coconstruction.

#### Scenario: Ordre respecté pour un utilisateur authentifié
- **WHEN** un utilisateur authentifié sans quota épuisé consulte ses résultats
- **THEN** l'ordre d'affichage est : recommandations → bouton "Voir les X autres" → BetaCapture → bloc coconstruction

#### Scenario: Alerte quota avant BetaCapture
- **WHEN** `quotaExhausted = true`
- **THEN** l'alerte quota est affichée en premier, avant BetaCapture

### Requirement: Source des opportunités avec fallback seed
Le server component SHALL récupérer les opportunités actives depuis l'API Payload CMS. Si l'appel échoue ou retourne zéro opportunités, il SHALL utiliser les données de `src/data/seed-opportunities.ts`.

#### Scenario: Opportunités chargées depuis Payload CMS
- **WHEN** Payload CMS est disponible et contient des opportunités actives
- **THEN** le matching utilise ces opportunités réelles

#### Scenario: Fallback sur seed si Payload indisponible
- **WHEN** l'appel à l'API Payload CMS échoue (réseau, DB non configurée)
- **THEN** les opportunités du seed enrichi sont utilisées pour le matching sans erreur côté utilisateur
