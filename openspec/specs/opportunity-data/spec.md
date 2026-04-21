### Requirement: Couverture complète des profils utilisateur
Le seed SHALL contenir au minimum 3 opportunités éligibles pour chaque valeur de `academic_level` (bac, bac2, licence, master, doctorat), de sorte que le paywall (FREE_LIMIT = 2) soit déclenché pour tous les profils.

#### Scenario: Profil bac voit le paywall
- **WHEN** un utilisateur répond `academic_level: "bac"` au test
- **THEN** le matching retourne au moins 3 opportunités éligibles, dont 1+ verrouillée derrière le paywall

#### Scenario: Profil bac2 voit le paywall
- **WHEN** un utilisateur répond `academic_level: "bac2"` au test
- **THEN** le matching retourne au moins 3 opportunités éligibles, dont 1+ verrouillée derrière le paywall

#### Scenario: Profil doctorat voit le paywall
- **WHEN** un utilisateur répond `academic_level: "doctorat"` au test
- **THEN** le matching retourne au moins 3 opportunités éligibles, dont 1+ verrouillée derrière le paywall

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

### Requirement: Option echange dans le schéma Payload
La collection Payload `opportunities` SHALL inclure `{ label: "Échange", value: "echange" }` dans les options du champ `category`, aligné sur la valeur `"echange"` utilisée dans les réponses du test et dans le seed.

#### Scenario: Opportunité echange saisie via admin
- **WHEN** un admin crée une opportunité avec `category: "echange"` via le back-office Payload
- **THEN** la valeur est acceptée et le matcher associe correctement à l'objectif `"echange"` de l'utilisateur
