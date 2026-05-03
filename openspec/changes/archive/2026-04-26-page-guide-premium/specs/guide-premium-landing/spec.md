## ADDED Requirements

### Requirement: Page de présentation Guide Premium

Le système SHALL afficher une page publique `/guide-premium` présentant le produit KRAAK Premium Guide avec : proposition de valeur, liste des bénéfices, tarifs mensuel (2 500 XOF) et annuel (19 900 XOF), et un formulaire d'inscription à la liste d'attente.

#### Scenario: Visiteur non authentifié accède à la page

- **WHEN** un visiteur navigue vers `/guide-premium` sans être connecté
- **THEN** la page s'affiche complètement sans redirection

#### Scenario: Utilisateur authentifié accède à la page

- **WHEN** un utilisateur connecté clique sur le CTA de l'UpsellGuide dans `/catalog`
- **THEN** la page `/guide-premium` s'affiche avec un lien de retour vers `/catalog`

---

### Requirement: Formulaire d'inscription liste d'attente

Le système SHALL permettre à tout visiteur de soumettre son adresse email pour rejoindre la liste d'attente du Guide Premium.

#### Scenario: Inscription avec email valide

- **WHEN** le visiteur saisit un email valide et soumet le formulaire
- **THEN** le système enregistre l'email dans `WaitlistEntry` et affiche un message de confirmation

#### Scenario: Email déjà inscrit

- **WHEN** le visiteur soumet un email déjà présent dans `WaitlistEntry`
- **THEN** le système retourne un message "Tu es déjà sur la liste !" sans créer de doublon

#### Scenario: Email invalide

- **WHEN** le visiteur soumet un email au format invalide
- **THEN** le formulaire affiche un message d'erreur de validation sans appel API

---

### Requirement: API liste d'attente

Le système SHALL exposer `POST /api/guide-premium/waitlist` pour enregistrer les inscriptions.

La requête contient `{ email: string }`. La réponse SHALL être :
- `200 { success: true }` si inscription réussie ou déjà inscrit
- `400 { error: string }` si email invalide ou corps manquant

L'`email` MUST être validé côté serveur (format RFC 5322 basique).

#### Scenario: Inscription réussie

- **WHEN** une requête POST valide est reçue avec un email non existant
- **THEN** une entrée `WaitlistEntry` est créée et la réponse retourne `{ success: true }`

#### Scenario: Doublon géré silencieusement

- **WHEN** une requête POST est reçue avec un email déjà enregistré (erreur Prisma P2002)
- **THEN** la réponse retourne `200 { success: true }` sans créer de doublon

---

### Requirement: Modèle WaitlistEntry

Le système SHALL stocker les inscriptions en liste d'attente dans une table `WaitlistEntry` avec les champs : `id` (cuid), `email` (unique), `source` (défaut "guide-premium"), `created_at`.

#### Scenario: Unicité de l'email garantie

- **WHEN** deux requêtes avec le même email sont reçues
- **THEN** seule une entrée existe en base de données

---

### Requirement: Email de confirmation

Le système SHALL envoyer un email de confirmation à l'adresse inscrite via Resend après inscription réussie.

L'envoi est fire-and-forget : une erreur Resend ne doit pas bloquer la réponse API ni annuler l'inscription.

#### Scenario: Confirmation envoyée

- **WHEN** une inscription est créée avec succès
- **THEN** Resend envoie un email de confirmation à l'adresse fournie

#### Scenario: Resend indisponible

- **WHEN** l'appel Resend échoue (timeout, erreur réseau)
- **THEN** l'inscription reste valide et la réponse API retourne `200 { success: true }`
