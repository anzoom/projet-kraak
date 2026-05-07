# Spec : Catalogue Guide Premium

## Purpose

Le catalogue Guide Premium permet aux utilisateurs abonnés au KRAAK Premium Guide d'accéder à l'intégralité des opportunités disponibles sur la plateforme, avec des filtres avancés et une recherche textuelle. Les utilisateurs non-abonnés voient un aperçu flouté accompagné d'une page de vente (upsell).

---

## Requirements

### REQ-CAT-01 : Accès conditionnel au catalogue

Le système SHALL vérifier que l'utilisateur possède un abonnement Guide Premium actif avant d'afficher le catalogue complet.

**Règle d'accès :** `status IN ['ACTIVE', 'CANCELLED'] AND current_period_end > NOW()`

Un abonnement annulé (CANCELLED) conserve l'accès jusqu'à la fin de la période en cours.

---

### REQ-CAT-02 : Authentification obligatoire

Le système SHALL rediriger les utilisateurs non authentifiés vers `/auth/login?next=/catalog` avant tout rendu de la page catalogue.

---

### REQ-CAT-03 : Affichage du catalogue (abonnés)

Le système SHALL afficher la liste complète des opportunités actives aux utilisateurs abonnés, incluant :
- Filtres pills scrollables : catégorie, zone géographique, type de financement, deadline
- Recherche textuelle sur le titre
- Compteur dynamique des résultats filtrés (avec mention des éditions passées)
- Cartes d'opportunités (CatalogCard) avec modal de détail
- État vide si aucun résultat ne correspond aux filtres

---

### REQ-CAT-04 : CatalogCard

Chaque carte d'opportunité SHALL afficher :
- Badge catégorie + zone géographique
- Titre de l'opportunité
- Type de financement + deadline (badge "⏰" si < 30 jours, barré si expiré)
- Description courte (2 lignes max)
- Bouton "Voir les détails" ouvrant OpportunityDetailModal
- SaveButton (favori)

---

### REQ-CAT-05 : Page upsell (non-abonnés)

Le système SHALL afficher une page upsell aux utilisateurs authentifiés sans abonnement actif, incluant :
- Aperçu flouté de 3 cartes d'opportunités réelles
- Nombre total d'opportunités actives accessibles aux abonnés
- Liste des bénéfices du Guide Premium
- Tarifs : 2 500 XOF/mois et 19 900 XOF/an (annuel mis en avant)
- CTA vers `/guide-premium`
- Note "Paiement bientôt disponible" avec lien liste d'attente

---

### REQ-CAT-06 : Modèle de données GuideSubscription

Le système SHALL stocker les abonnements dans la table `GuideSubscription` avec les champs :
- `plan` : MONTHLY | ANNUAL
- `status` : ACTIVE | CANCELLED | EXPIRED
- `current_period_end` : date d'expiration de la période en cours

---

### REQ-CAT-07 : API d'accès Guide Premium

Le système SHALL exposer `GET /api/user/guide-access` retournant :
- `{ hasAccess: true, plan, expiresAt }` si abonnement valide
- `{ hasAccess: false }` si aucun abonnement valide
- `401` si non authentifié

L'`user_id` MUST être extrait du JWT Supabase côté serveur, jamais du body de la requête.

---

### REQ-CAT-08 : Point d'entrée depuis les résultats

Le système SHALL afficher un lien "Voir tout le catalogue (N opportunités) →" dans ResultsClient, visible uniquement pour les utilisateurs authentifiés.

---

### REQ-CAT-09 : Statut abonnement dans le profil

Le système SHALL afficher le statut de l'abonnement Guide Premium dans le profil utilisateur (ProfileClient) : plan actif/inactif, date d'expiration, lien vers le catalogue.

---

## Scenarios

### Scénario 1 : Utilisateur non connecté accède à /catalog

1. Le middleware détecte l'absence de session
2. Redirection vers `/auth/login?next=/catalog`
3. Après connexion, retour vers `/catalog`

### Scénario 2 : Utilisateur connecté sans abonnement

1. Authentification vérifiée côté serveur
2. Aucun GuideSubscription actif trouvé
3. Affichage de UpsellGuide avec aperçu flouté et tarifs

### Scénario 3 : Abonné accède au catalogue

1. Authentification + abonnement actif vérifiés côté serveur
2. Toutes les opportunités chargées
3. Affichage de CatalogClient avec filtres et liste complète

### Scénario 4 : Abonné filtre par catégorie

1. L'utilisateur clique sur un filtre pill (ex. "Bourse")
2. La liste se met à jour côté client sans rechargement
3. Le compteur affiche le nombre de résultats filtrés

### Scénario 5 : Non-abonné clique sur le CTA

1. L'utilisateur clique sur "Accéder au Guide Premium →"
2. Redirection vers `/guide-premium` (page dédiée Phase 2)
3. En attendant : lien liste d'attente via mailto
