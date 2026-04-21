## MODIFIED Requirements

### Requirement: Bouton Voir les détails sur chaque carte
Chaque `RecommendationCard` SHALL afficher un bouton "Voir les détails" en bas de carte, remplaçant le lien direct "Postuler →". Le lien de candidature SHALL uniquement apparaître dans le modal de détail.

#### Scenario: Bouton Voir les détails visible
- **WHEN** une carte de recommandation est affichée
- **THEN** un bouton "Voir les détails" est visible en bas de la carte

#### Scenario: Lien Postuler absent de la carte
- **WHEN** une opportunité a un `source_url`
- **THEN** ce lien n'est pas affiché sur la carte, uniquement dans le modal

### Requirement: Modal de détail opportunité
Le clic sur "Voir les détails" SHALL ouvrir un `OpportunityDetailModal` affichant : titre, catégorie, pays, type de financement, deadline (si définie), budget requis (si > 0), description complète, conditions d'éligibilité et démarche de candidature.

#### Scenario: Ouverture du modal
- **WHEN** l'utilisateur clique "Voir les détails"
- **THEN** le modal s'ouvre, le scroll de la page est bloqué

#### Scenario: Fermeture par backdrop
- **WHEN** l'utilisateur clique hors du modal (backdrop)
- **THEN** le modal se ferme

#### Scenario: Fermeture par bouton ×
- **WHEN** l'utilisateur clique le bouton × en en-tête du modal
- **THEN** le modal se ferme

#### Scenario: Fermeture par Escape
- **WHEN** l'utilisateur appuie sur la touche Escape
- **THEN** le modal se ferme

### Requirement: Démarche de candidature par catégorie
Le modal SHALL afficher une liste de 5 étapes de candidature adaptées à la catégorie de l'opportunité (`bourse`, `formation`, `echange`, `stage`, `emploi`).

#### Scenario: Étapes bourse
- **WHEN** `opportunity.category = "bourse"`
- **THEN** les étapes affichées couvrent : vérification éligibilité, constitution dossier, formulaire, soumission, suivi

#### Scenario: Catégorie inconnue — fallback bourse
- **WHEN** `opportunity.category` n'est pas dans le mapping connu
- **THEN** les étapes de la catégorie `bourse` sont affichées

### Requirement: CTA Postuler dans le modal
Le modal SHALL afficher un bouton "Postuler sur le site officiel →" en pied uniquement si `opportunity.source_url` est défini. Ce bouton ouvre l'URL en nouvel onglet.

#### Scenario: CTA présent si source_url défini
- **WHEN** `opportunity.source_url` est non nul
- **THEN** le bouton CTA est affiché en bas du modal

#### Scenario: CTA absent si source_url manquant
- **WHEN** `opportunity.source_url` est null
- **THEN** aucun bouton de candidature n'est affiché, sans erreur
