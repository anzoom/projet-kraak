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
La page SHALL afficher les 2 premières `Recommendation[]` (triées par `match_score` décroissant) avec : titre de l'opportunité, pays, catégorie, deadline (si définie), type de financement, justification, description courte (si disponible), et un lien de candidature (si `source_url` défini).

#### Scenario: Deux recommandations libres visibles
- **WHEN** le matching produit au moins 2 recommandations
- **THEN** les 2 premières sont affichées complètement sans verrouillage

#### Scenario: Moins de 2 recommandations disponibles
- **WHEN** le matching produit 0 ou 1 recommandation
- **THEN** seules les disponibles sont affichées, sans erreur

#### Scenario: Catalogue vide — message dédié
- **WHEN** aucune opportunité n'est disponible (ni Payload ni seed)
- **THEN** la page affiche un message "Catalogue en cours de construction" sans erreur

#### Scenario: Description courte affichée dans la card
- **WHEN** une recommandation a un champ `short_description` non nul
- **THEN** ce texte est affiché sous le titre de l'opportunité dans la card

#### Scenario: Bouton Voir les détails affiché sur la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** un bouton "Voir les détails" est affiché sur la card, ouvrant la modale de détail

#### Scenario: Bouton Postuler absent de la card
- **WHEN** une recommandation est affichée dans la liste
- **THEN** aucun bouton "Postuler" n'est affiché directement sur la card

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

### Requirement: Source des opportunités avec fallback seed
Le server component SHALL récupérer les opportunités actives depuis l'API Payload CMS. Si l'appel échoue ou retourne zéro opportunités, il SHALL utiliser les données de `src/data/seed-opportunities.ts`.

#### Scenario: Opportunités chargées depuis Payload CMS
- **WHEN** Payload CMS est disponible et contient des opportunités actives
- **THEN** le matching utilise ces opportunités réelles

#### Scenario: Fallback sur seed si Payload indisponible
- **WHEN** l'appel à l'API Payload CMS échoue (réseau, DB non configurée)
- **THEN** les opportunités du seed enrichi sont utilisées pour le matching sans erreur côté utilisateur
