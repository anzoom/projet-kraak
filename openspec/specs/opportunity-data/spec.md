### Requirement: Couverture complète des profils utilisateur
Le seed SHALL contenir au minimum 10 opportunités éligibles pour chaque valeur de `academic_level` (bac, bac2, licence, master, doctorat), de sorte que le quota gratuit (MAX_FREE = 10) soit atteint pour tous les profils types.

#### Scenario: Profil bac — quota rempli
- **WHEN** un utilisateur répond `academic_level: "bac"` au test
- **THEN** le matching retourne au moins 10 opportunités éligibles

#### Scenario: Profil bac2 — quota rempli
- **WHEN** un utilisateur répond `academic_level: "bac2"` au test
- **THEN** le matching retourne au moins 10 opportunités éligibles

#### Scenario: Profil doctorat — quota rempli
- **WHEN** un utilisateur répond `academic_level: "doctorat"` au test
- **THEN** le matching retourne au moins 10 opportunités éligibles

### Requirement: Couverture de la catégorie emploi
Le seed SHALL contenir au minimum 3 opportunités de catégorie `emploi`, accessibles à des niveaux variés (`licence`, `master`, `tous`).

#### Scenario: Objectif emploi retourne des résultats
- **WHEN** un utilisateur répond `main_objective: "emploi"` au test
- **THEN** au moins 3 opportunités de catégorie `emploi` passent le filtre de niveau et sont présentées

### Requirement: Champs riches renseignés dans le seed
Chaque entrée du seed SHALL renseigner `short_description` (≤ 280 caractères), `source_url` (URL HTTPS valide et vérifiée) et `eligibility_summary` (conditions principales en 1–2 phrases). Ces champs sont optionnels dans le type mais obligatoires dans le seed.

#### Scenario: Description affichée dans la card
- **WHEN** une recommandation issue du seed est affichée
- **THEN** `short_description` est visible dans la `RecommendationCard`

#### Scenario: Bouton Postuler disponible
- **WHEN** une recommandation issue du seed est affichée et `source_url` est renseigné
- **THEN** un lien "Postuler →" pointe vers l'URL officielle du programme

### Requirement: Alignement des valeurs canoniques funding_type
Le seed et le schéma Payload SHALL utiliser la valeur `"partial"` (et non `"partielle"`) pour désigner un financement partiel, aligné sur la clé utilisée dans `FUNDING_LABELS` de `RecommendationCard`.

#### Scenario: Label financement partiel affiché correctement
- **WHEN** une opportunité a `funding_type: "partial"`
- **THEN** la card affiche "Financement partiel" (via `FUNDING_LABELS`)

### Requirement: Champ location optionnel dans le schéma Payload
La collection Payload CMS `opportunities` SHALL inclure un champ `location` de type texte, optionnel, destiné à préciser le pays ou la ville d'accueil (ex : "France", "USA / Canada", "Cameroun"). Ce champ est purement informatif : il n'intervient pas dans le matching et ne constitue pas un filtre. Il est propagé dans le type TypeScript `Opportunity` et dans la fonction `fetchOpportunities()`.

#### Scenario: Location affichée dans la modale si renseignée
- **WHEN** une opportunité a un `location` non vide
- **THEN** un badge `📍 <location>` est visible dans la modale de détail

#### Scenario: Location absente sans erreur
- **WHEN** une opportunité n'a pas de `location`
- **THEN** aucun badge lieu n'est affiché et le matching fonctionne normalement

#### Scenario: Location sans impact sur le matching
- **WHEN** deux opportunités ont le même `country` (zone) mais des `location` différents
- **THEN** le moteur de matching les traite de façon identique — seul `country` est utilisé comme filtre

### Requirement: Option echange dans le schéma Payload
La collection Payload `opportunities` SHALL inclure `{ label: "Échange", value: "echange" }` dans les options du champ `category`, aligné sur la valeur `"echange"` utilisée dans les réponses du test et dans le seed.

#### Scenario: Opportunité echange saisie via admin
- **WHEN** un admin crée une opportunité avec `category: "echange"` via le back-office Payload
- **THEN** la valeur est acceptée et le matcher associe correctement à l'objectif `"echange"` de l'utilisateur
