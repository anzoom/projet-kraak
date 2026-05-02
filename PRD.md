# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Produit : KRAAK
## Version : MVP V2.3 — Gratuit + Guide Premium + Coaching (paiement Chariow + alertes deadlines + pages légales)
## Statut : Validé
## Owner : Founder / Product Lead
## Dernière mise à jour : 2026-04-28

---

# 1. Résumé exécutif

## 1.1 Vision
KRAAK est une plateforme numérique d'orientation et d'accès aux opportunités destinée en priorité aux étudiants africains. Le produit aide l'utilisateur à identifier rapidement les opportunités les plus pertinentes pour son profil (bourses, programmes, fellowships, concours, prix) et à maximiser ses chances de succès.

## 1.2 Problème
Les utilisateurs cibles font face à :
- une information fragmentée et peu fiable ;
- une difficulté à savoir quelles opportunités leur correspondent réellement ;
- un manque d'accompagnement simple, rapide et abordable ;
- une forte asymétrie d'information sur les conditions d'éligibilité, les délais et la stratégie de candidature.

## 1.3 Proposition de valeur
**"Accède gratuitement aux meilleures opportunités adaptées à ton profil en quelques minutes."**

Pour les utilisateurs qui veulent aller plus loin :
**"Accède au catalogue complet, apprends à décrocher les meilleures opportunités, ne rate plus aucune deadline."** *(KRAAK Premium Guide)*

## 1.4 Pivot stratégique
Le modèle freemium avec paywall est abandonné. KRAAK devient une plateforme **entièrement gratuite** pour l'accès aux opportunités, avec une monétisation indirecte et un coaching premium optionnel. Ce pivot vise à maximiser l'acquisition, l'usage et la rétention, tout en ouvrant des revenus plus durables.

Le **KRAAK Premium Guide** est le second pilier de monétisation directe, complémentaire au coaching. Il cible les utilisateurs souhaitant approfondir leur stratégie et accéder à un catalogue élargi.

## 1.5 Objectif du MVP
Valider rapidement :
- l'intérêt utilisateur pour un accès gratuit et immédiat ;
- la qualité perçue du matching (5 opportunités ultra pertinentes) ;
- la conversion vers le coaching premium et le Guide Premium.

---

# 2. Objectifs produit

## 2.1 Objectifs business
- Maximiser l'acquisition utilisateur (accès gratuit sans friction).
- Générer des revenus via monétisation indirecte, coaching premium et Guide Premium.
- Construire une base de données d'opportunités qualifiées et enrichies.
- Obtenir des retours utilisateurs structurés pour améliorer le matching.
- Préparer une extension vers lead generation, affiliation et opportunités sponsorisées.

## 2.2 Objectifs utilisateurs
- Accéder immédiatement à des opportunités adaptées sans payer.
- Comprendre pourquoi une opportunité est pertinente pour leur profil.
- Maximiser leurs chances d'acceptation grâce au coaching.
- Apprendre à construire un dossier gagnant (Guide Premium).
- Revenir régulièrement découvrir de nouvelles opportunités.

## 2.3 KPIs de succès MVP
- Taux de complétion du test > 60%
- Taux d'affichage des résultats > 80%
- Taux de clic sur une opportunité > 40%
- Taux de clic vers coaching > 15%
- Taux de conversion coaching > 5%
- Taux de clic vers Guide Premium > 10%
- Taux de conversion Guide Premium > 3%
- Taux de retour utilisateur (J+7) > 30%
- Taux de rebond landing page < 60%

---

# 3. Portée du produit

## 3.1 In scope (MVP — Phase 1)
- Landing page
- Test de profil / orientation
- Moteur de scoring
- Matching : max 10 opportunités (5 affichées initialement, 5 révélables)
- Explication de pertinence par opportunité
- Badges visuels de mise en avant
- Bloc coaching premium (upsell non bloquant)
- Compte utilisateur (authentification)
- Historique des résultats

## 3.2 In scope (Phase 2)
- **KRAAK Premium Guide** : guide interactif + catalogue élargi + alertes + newsletter
- Tunnel de souscription Guide Premium (mensuel / annuel via Chariow)
- Paiement coaching via Chariow (liens produit hébergés)
- **Intégration Chariow pre-checkout token** : activation automatique de l'abonnement après retour Chariow ✅ *implémenté*
- **Alertes deadlines 90/30/7 jours** : rappels email pour les abonnés Guide Premium sur leurs opportunités sauvegardées ✅ *implémenté*
- **Pages légales** : `/confidentialite`, `/conditions`, `/contact` ✅ *implémenté*
- Notifications (nouvelles opportunités)
- Rotation dynamique des opportunités
- Amélioration du matching
- Tracking avancé (clics, conversions)

## 3.3 In scope (Phase 3)
- Intégration paiement native (CinetPay / Mobile Money) si les volumes Chariow le justifient
- Webhooks Chariow natifs pour renouvellement et révocation d'abonnement automatiques
- Workflow automatisé post-coaching (suivi, relance, CRM)
- Monétisation indirecte : lead generation, affiliation
- Opportunités sponsorisées
- Score évolutif utilisateur
- Dashboard analytics avancé

## 3.4 Hors scope (MVP)
- Paywall ou paiement pour accéder aux opportunités de base
- Marketplace complète
- Réservation de mentors
- Messagerie temps réel
- Réseau social / communauté
- Mode hors ligne complet

---

# 4. Modèle de monétisation

## 4.1 Principe
L'accès aux 10 meilleures opportunités (5 affichées initialement, 5 révélables) est **entièrement gratuit**. La monétisation repose sur cinq piliers :

### Guide Premium
Abonnement mensuel (2 500 XOF) ou annuel (19 900 XOF) donnant accès aux 9 modules du guide interactif, aux 20 recommandations matching (vs 10 gratuit, avec sauvegarde jusqu'à 15 favoris), aux alertes personnalisées et à la newsletter. Offre principale : l'annuel à moins de 3€/mois. Paiement géré par **Chariow** (page produit hébergée, lien direct depuis `/guide-premium`).

### Coaching
Accompagnement personnalisé proposé après l'affichage des résultats. Deux formules : audit de dossier (15 000 XOF) et accompagnement complet (50 000 XOF). Paiement géré par **Chariow** (une page produit par offre, lien direct depuis `/coaching`).

### Lead generation
Mise en relation rémunérée entre utilisateurs qualifiés et écoles, programmes ou employeurs partenaires.

### Affiliation
Redirection vers des plateformes partenaires (Campus France, établissements, etc.) avec commission sur les inscriptions ou candidatures générées.

### Opportunités sponsorisées
Mise en avant payante d'opportunités par des institutions ou programmes partenaires dans le flux de recommandations.

---

# 5. Personas et utilisateurs cibles

## 5.1 Persona principal
### Étudiant ambitieux
- Âge : 16–28 ans
- Localisation : Afrique francophone en priorité
- Usage dominant : smartphone
- Objectif : bourse, formation, mobilité académique, évolution professionnelle
- Contraintes : temps limité, budget limité, incertitude, besoin de simplicité

## 5.2 Persona secondaire
### Jeune diplômé en repositionnement
- Cherche une formation, un programme, un stage ou une passerelle internationale
- Attentif au retour sur investissement
- Besoin de recommandations ciblées et fiables

## 5.3 Persona Guide Premium
### Candidat préparé
- A déjà obtenu ses résultats KRAAK gratuits
- Veut comprendre la méthodologie et maximiser ses chances
- Prêt à investir un faible montant mensuel ou annuel pour accéder aux ressources
- Sensible à l'argument "moins de 3€/mois" pour un cycle de candidature entier

---

# 6. Parcours utilisateur principal

## 6.1 Parcours gratuit (Phase 1)
1. L'utilisateur arrive sur la landing page.
2. Il comprend la promesse du produit (accès gratuit, résultat en 3 min).
3. Il clique sur "Tester mon profil".
4. Il répond au questionnaire (10 questions).
5. Le système calcule son profil.
6. L'utilisateur crée son compte ou se connecte.
7. Il accède à ses **5 opportunités ultra pertinentes** avec explication de pertinence.
8. Il voit le bloc coaching : "🔥 3 opportunités sont particulièrement adaptées à ton profil. Veux-tu maximiser tes chances d'être accepté ?"
9. Il peut cliquer sur "Optimiser mon dossier" ou "Être accompagné".
10. Il peut revenir consulter ses résultats et découvrir de nouvelles opportunités.

## 6.2 Parcours Guide Premium
1. L'utilisateur voit le bloc Guide Premium sur la page résultats ou landing page.
2. Il accède à `/guide` (liste des modules, contenu verrouillé) ou directement à `/guide-premium`.
3. Il choisit une formule (mensuelle ou annuelle — annuelle mise en avant).
4. Un clic sur "Souscrire" appelle `POST /api/checkout/initiate` — un `CheckoutSession` avec token UUID est créé.
5. KRAAK redirige vers la page produit Chariow avec `?success_url=kraak.co/guide/success?token=…`.
6. L'utilisateur complète le paiement sur Chariow (carte, Mobile Money selon intégrations Chariow).
7. Chariow redirige vers `kraak.co/guide/success?token=…`.
8. La page `/guide/success` appelle `GET /api/checkout/verify?token=…` — le `GuideSubscription` est créé en base + email de bienvenue envoyé.
9. L'utilisateur est redirigé vers `/guide` avec accès complet immédiat.

---

# 7. Exigences fonctionnelles — Produit gratuit

## 7.1 Landing page
### Objectif
Expliquer clairement la valeur du produit et pousser au démarrage du test.

### Exigences
- Présenter la promesse principale (accès gratuit, résultat immédiat).
- Afficher un CTA principal visible immédiatement.
- Présenter les bénéfices utilisateur.
- Inclure des éléments de réassurance.
- Être optimisée pour mobile.

### Critères d'acceptation
- Le CTA principal est visible sans scroll sur mobile.
- Le temps de compréhension de la proposition de valeur est inférieur à 10 secondes.
- L'utilisateur peut démarrer le test en un clic.

---

## 7.2 Test de profil
### Objectif
Qualifier rapidement l'utilisateur et collecter les informations nécessaires au scoring.

### Exigences
- Le test comprend 10 questions maximum.
- Les questions sont principalement à choix simple.
- Une barre de progression doit être visible.
- L'utilisateur doit pouvoir naviguer entre les étapes.
- Le temps moyen de complétion doit rester inférieur à 2 minutes.

### Données collectées
- Pays d'origine
- Niveau actuel
- Objectif principal
- Domaine d'intérêt
- Zone géographique cible
- Budget
- Niveau académique (dernier diplôme)
- Maturité du dossier
- Blocage principal
- Horizon temporel

### Critères d'acceptation
- Les réponses sont persistées en session.
- Le système peut restaurer un test interrompu si l'architecture le permet.
- Après le test : création de compte ou connexion → résultats.

---

## 7.3 Scoring
### Objectif
Transformer les réponses en profil utilisateur exploitable.

### Exigences
- Le moteur calcule un score académique, financier et de maturité.
- Le moteur classe l'utilisateur dans un segment de profil.
- Les règles doivent être modifiables sans refonte majeure.
- Le système doit produire des explications compréhensibles.

### Critères d'acceptation
- Chaque résultat repose sur des règles traçables.
- Le calcul est déterministe sur un même jeu de réponses.

---

## 7.4 Matching et recommandations
### Objectif
Afficher jusqu'à 10 opportunités les plus adaptées au profil utilisateur (Classic) avec une explication de pertinence.

### Exigences
- **Maximum 10 opportunités** dans le quota Classic (5 affichées initialement, 5 révélables via bouton).
- Filtrage strict par : objectif, domaine, pays cible, niveau académique, budget, horizon de départ.
- Tri par score de pertinence décroissant.
- Chaque opportunité doit afficher :
  - titre, pays, type, niveau, budget requis, deadline, lien source, description synthétique
  - **explication de pertinence** : "Pourquoi cette opportunité est adaptée à ton profil"
  - **badge visuel** selon niveau de pertinence
- Prioriser la qualité et la pertinence sur la quantité.

### Badges visuels
- **"🔥 Top recommandé pour toi"** : sur 1 à 2 opportunités à score maximal
- **"🎯 Forte probabilité d'acceptation"** : selon scoring utilisateur (maturité dossier + niveau académique élevés)

### Critères d'acceptation
- L'utilisateur voit exactement 1 à 5 opportunités (selon disponibilité après filtrage).
- Chaque opportunité affichée possède une justification visible.
- Les badges sont cohérents avec le score calculé.

---

## 7.5 Coaching premium (upsell)
### Objectif
Proposer naturellement un accompagnement payant après l'affichage des résultats, sans bloquer l'accès gratuit.

### Déclenchement
Après affichage des 5 opportunités, un bloc coaching met en avant 2 à 3 opportunités "prioritaires".

### Wording
> "🔥 3 opportunités sont particulièrement adaptées à ton profil.
> Veux-tu maximiser tes chances d'être accepté ?"

### CTAs
- **"Optimiser mon dossier"**
- **"Être accompagné"**

### Parcours
1. Clic CTA → `/coaching`
2. Choix d'offre (audit dossier 15 000 XOF, accompagnement complet 50 000 XOF)
3. Clic "Réserver et payer" → page produit Chariow correspondante
4. Paiement sur Chariow → redirection vers `kraak.co/coaching`
5. Confirmation et planification du créneau par email post-paiement

### Exigences
- Le bloc coaching est visible mais non bloquant.
- L'utilisateur peut ignorer le coaching et accéder librement aux opportunités.
- Le wording et le positionnement doivent être naturels et non intrusifs.

### Critères d'acceptation
- Le bloc coaching s'affiche après les résultats.
- Le CTA redirige vers une page coaching dédiée.
- L'utilisateur non intéressé peut continuer sans friction.

---

## 7.6 Micro-optimisation (conversion & perception premium)
### Objectif
Renforcer la valeur perçue du matching et augmenter le taux de conversion vers le coaching.

### Exigences
- Afficher les 2 à 3 meilleures opportunités avec une mise en avant visuelle distincte.
- Afficher un message de transition :
  > "Ces opportunités méritent une candidature optimisée pour maximiser tes chances."
- Les badges doivent être cohérents avec le score calculé.
- L'interface doit transmettre une perception de qualité et de rareté.

### Critères d'acceptation
- La hiérarchisation visuelle est claire (top recommandé > autres).
- Le message de transition est visible avant le bloc coaching.

---

## 7.7 Compte utilisateur / accès
### Objectif
Permettre à l'utilisateur de retrouver ses résultats et d'accéder aux nouvelles opportunités.

### Exigences
- Création de compte après le test (avant affichage des résultats).
- Connexion / déconnexion.
- Réinitialisation de mot de passe.
- Historique des résultats.
- Score utilisateur évolutif (Phase 3).

### Critères d'acceptation
- L'utilisateur authentifié retrouve ses données.
- Les données d'un utilisateur ne sont jamais exposées à un autre.

---

## 7.8 Rétention utilisateur
### Objectif
Faire revenir l'utilisateur régulièrement sur la plateforme.

### Mécanismes
- **Nouvelles opportunités régulières** : enrichissement continu du catalogue.
- **Rotation dynamique** : rafraîchissement des 5 opportunités affichées selon les nouvelles disponibilités.
- **Notifications intelligentes** : alertes deadline, nouvelles offres correspondant au profil.
- **Mise à jour du profil** : l'utilisateur peut affiner ses réponses pour améliorer le matching.
- **Score évolutif** : visualisation de la progression du profil dans le temps.

### Core loop produit
1. Test initial → recommandations (max 5)
2. Notification → nouvelle opportunité disponible
3. Retour utilisateur → consultation
4. Mise à jour profil → nouveau matching
5. Upsell coaching / Guide Premium → conversion

---

## 7.9 Coconstruction du catalogue
### Objectif
Inviter les utilisateurs à contribuer activement à l'enrichissement du catalogue en signalant des opportunités identifiées hors de KRAAK, dans une démarche collaborative.

### Déclencheurs
- **Empty state** : quand le matching ne retourne aucune opportunité pour le profil de l'utilisateur.
- **Bas de liste** : systématiquement, en bas de la page résultats pour tout utilisateur authentifié ayant reçu des recommandations.

### Exigences
- Afficher un message honnête sur l'absence de résultat (empty state) sans dévaloriser l'utilisateur.
- Expliquer la démarche : les suggestions sont étudiées, enrichies et intégrées au catalogue.
- Fournir un lien de contribution simple (mailto pré-rempli) avec un template structuré : titre, lien officiel, type, niveau, zone géographique.
- Le bloc bas de liste est compact et non intrusif — il ne concurrence pas les CTAs coaching et guide premium.

### Critères d'acceptation
- L'empty state affiche le bloc coconstruction avec un lien fonctionnel.
- Le bloc bas de liste est visible pour tout utilisateur authentifié consultant ses recommandations (hors mode favoris).
- Le lien ouvre le client mail avec sujet et corps pré-remplis.

---

## 7.10 Back-office d'administration
### Objectif
Permettre à l'équipe de gérer les opportunités et de superviser l'application.

### Exigences
- CRUD opportunités
- Publication / dépublication
- Gestion des métadonnées (badges, sponsorisation)
- Ingestion semi-automatique des opportunités
- Enrichissement des données
- Suivi basique des interactions (clics, conversions)
- Consultation des KPIs principaux

### Critères d'acceptation
- Un admin peut ajouter et modifier une opportunité sans intervention technique.
- Une opportunité peut être désactivée immédiatement.

---

# 8. KRAAK Premium Guide — Produit Premium

## 8.1 Vision et positionnement

### Écosystème KRAAK
| Produit | Prix | Valeur |
|---|---|---|
| KRAAK (gratuit) | Gratuit | Identifie tes 10 meilleures opportunités |
| **KRAAK Premium Guide** | 2 500 XOF/mois ou 19 900 XOF/an | Apprends à les décrocher + 20 recommandations + alertes + newsletter |
| Coaching premium | 15 000–50 000 XOF/session | Accompagnement personnalisé sur ton dossier |

### Absence de cannibalisation
- Le **Guide** apporte une méthodologie générale applicable à toutes les candidatures.
- Le **Coaching** répond à une problématique personnelle sur un dossier spécifique.
- L'accès **gratuit** reste le point d'entrée — le Guide approfondit, il ne remplace pas.

## 8.2 Proposition de valeur
**"Accède au catalogue complet, apprends à décrocher les meilleures opportunités, ne rate plus aucune deadline."**

Le Guide s'adresse aux utilisateurs qui ont reçu leurs résultats gratuits et souhaitent passer à l'action avec méthode, en accédant à plus d'opportunités et en étant alertés en temps réel.

## 8.3 Contenu du Guide Premium

### 1. Guide interactif : "Bourses d'études & concours pour jeunes africains et diaspora"
Un guide complet couvrant :
- **Mindset et posture** : comment aborder une candidature internationale
- **Les étapes clés** : de la recherche à la soumission
- **Ressources et adresses** : plateformes, contacts, ressources incontournables
- **Constitution de dossier** : CV, lettre de motivation, lettres de recommandation
- **Bons plans** : astuces peu connues pour maximiser ses chances
- **Témoignages** : retours d'expérience de lauréats africains

### 2. Accès au catalogue élargi
- Accès à l'intégralité du catalogue KRAAK (149+ opportunités actives).
- Pas de limite aux 5 recommandations gratuites.
- Filtres avancés disponibles (par zone, catégorie, deadline, financement).

### 3. Alertes personnalisées
- Alertes email déclenchées sur les nouvelles opportunités correspondant au profil (cron hebdomadaire, lundi 8h).
- **Alertes deadlines** sur les opportunités sauvegardées : rappels à **J-90, J-30 et J-7** avant chaque deadline.
  - Configurables par opportunité (`alert_90d`, `alert_30d`, `alert_7d` — activés par défaut).
  - Idempotentes : un rappel par fenêtre temporelle, jamais en double.
  - Cron quotidien (7h) — réservé aux abonnés Guide Premium actifs.
  - Code couleur progressif : vert (J-90), orange (J-30), rouge (J-7).

### 4. Newsletter éditoriale
- Newsletter régulière : bons plans de la semaine, deadlines imminentes, témoignages, stratégies.
- Ton éditorial proche de l'utilisateur, orienté action et confiance.

## 8.4 Modèle tarifaire

| Formule | Prix | Équivalent mensuel | Recommandé |
|---|---|---|---|
| Mensuelle | 2 500 XOF (~4€) | ~4€/mois | Point d'entrée |
| **Annuelle** | **19 900 XOF (~30€)** | **<3€/mois** | **Offre principale** |

**Principes de pricing :**
- L'offre annuelle est mise en avant visuellement (badge "Le plus populaire").
- L'offre annuelle représente moins de 3€/mois, alignée sur le cycle naturel des candidatures (qui s'étend sur 12 mois).
- Pas d'offre 2 ans : horizon trop long pour amortir une décision de ce type.
- Les prix sont en XOF (valeur de référence), affichés aussi en euros pour la diaspora.

## 8.5 Stack technique de paiement

### Phase 2 — Chariow (pre-checkout token)

**Plateforme unique : Chariow** — pages produit hébergées + redirection post-paiement paramétrée.

| Route | Rôle |
|---|---|
| `POST /api/checkout/initiate` | Crée un `CheckoutSession` (token UUID, validité 1h), retourne l'URL Chariow enrichie |
| `GET /api/checkout/verify?token=` | Vérifie le token, active `GuideSubscription` en transaction atomique, envoie l'email de bienvenue |
| `GET /guide/success?token=` | Page de retour post-Chariow — appelle verify, affiche état succès/erreur |
| `POST /api/webhooks/chariow` | Stub Phase 3 — validation HMAC prête, inactive pour le MVP |

**Flux de réconciliation :**
1. KRAAK génère un token avant redirection → stocké dans `CheckoutSession`
2. Chariow redirige vers `/guide/success?token=xxx` après paiement
3. KRAAK vérifie le token côté serveur et active l'accès
4. **Fallback** : si l'utilisateur est toujours authentifié, la session Supabase permet la réconciliation même si le token expire

**Produits Chariow à créer (URLs à renseigner dans les variables d'env) :**
- Guide KRAAK — Plan mensuel (2 500 XOF/mois) → `NEXT_PUBLIC_CHARIOW_GUIDE_MONTHLY_URL`
- Guide KRAAK — Plan annuel (19 900 XOF/an) → `NEXT_PUBLIC_CHARIOW_GUIDE_ANNUAL_URL`
- Coaching — Audit de dossier (15 000 XOF) → `NEXT_PUBLIC_CHARIOW_COACHING_AUDIT_URL`
- Coaching — Accompagnement complet (50 000 XOF) → `NEXT_PUBLIC_CHARIOW_COACHING_ACCOMPAGNEMENT_URL`

### Phase 3 — Webhooks Chariow natifs + paiement natif CinetPay
- Activation des webhooks Chariow (`POST /api/webhooks/chariow`) avec validation HMAC
- Intégration CinetPay/Notchpay directe si les volumes le justifient

## 8.6 Exigences fonctionnelles

### Page de présentation du Guide Premium
- Présenter les 4 composantes de l'offre (guide, catalogue, alertes, newsletter).
- Afficher les deux formules tarifaires avec l'annuelle mise en avant.
- Inclure des éléments de réassurance (exemples de contenu, témoignages).
- CTA clair : "Commencer maintenant" → tunnel de souscription.

### Tunnel de souscription
- Choix de formule (mensuelle / annuelle).
- Clic → `POST /api/checkout/initiate` → redirection vers Chariow avec token embarqué dans `success_url`.
- Retour sur `/guide/success?token=` → activation automatique du `GuideSubscription` en base.
- Email de bienvenue automatique (Resend) avec lien d'accès au guide.
- En cas d'erreur (token invalide/expiré) : page d'erreur avec contact support.

### Espace Guide Premium
- Accessible aux abonnés actifs uniquement.
- Accès au guide interactif (structuré par chapitres).
- Accès au catalogue complet avec filtres avancés.
- Gestion des alertes (activation, fréquence, profil).

### Gestion de l'abonnement
- Résiliation possible à tout moment (mensuel) ou à l'échéance (annuel).
- Statut d'abonnement visible dans l'espace utilisateur.

## 8.7 Critères d'acceptation

- L'utilisateur peut souscrire en moins de 5 minutes.
- Le guide est accessible immédiatement après confirmation de paiement.
- Le catalogue élargi est distinct et clairement différencié des 5 recommandations gratuites.
- Les alertes sont envoyées automatiquement selon le profil et les nouvelles opportunités.
- En cas d'échec de paiement, l'utilisateur est informé sans perdre ses données.

---

# 9. Exigences non fonctionnelles

## 9.1 Performance
- Temps de chargement initial mobile : < 3 secondes en réseau correct
- Temps de réponse API critique : < 1 seconde
- Temps de calcul du résultat : < 2 secondes après soumission

## 9.2 Disponibilité et fiabilité
- Disponibilité cible MVP : 99,5% minimum
- Gestion propre des erreurs front et back
- Journalisation des erreurs applicatives

## 9.3 Sécurité
- Chiffrement TLS pour tous les échanges
- Hash sécurisé des mots de passe
- Protection XSS, CSRF, injection, brute force
- Validation stricte des entrées utilisateur
- Contrôle d'accès basé sur les rôles
- Limitation de débit sur login / endpoints sensibles
- Secrets et clés API jamais exposés côté client

## 9.4 Protection des données personnelles
- Collecter uniquement les données nécessaires
- Informer l'utilisateur de la finalité de la collecte
- Consentement explicite pour communications marketing
- Transparence sur l'usage des données de profil

## 9.5 UX / UI
- Mobile-first
- Accès immédiat à la valeur (sans friction)
- Affichage limité mais premium (max 5 opportunités gratuites)
- Perception de qualité et de rareté
- Mise en avant intelligente des opportunités prioritaires
- Intégration naturelle et non intrusive du coaching et du Guide Premium
- États de chargement explicites
- Messages d'erreur compréhensibles

## 9.6 Automatisation
- Ingestion semi-automatique des opportunités
- Enrichissement automatique des données
- Matching automatique au chargement des résultats
- Notifications automatiques (deadlines, nouvelles offres)
- Alertes Guide Premium déclenchées automatiquement
- Tracking automatique des interactions (clics, conversions)

## 9.7 Scalabilité
- Architecture permettant d'ajouter de nouveaux types d'opportunités
- Possibilité d'introduire coaching, lead gen, affiliation, Guide Premium
- Moteur de règles de scoring extensible
- Modèle de données modulaire

---

# 10. Data & Tracking

## 10.1 Événements à tracker
- Vue landing page
- Démarrage test
- Complétion test
- Affichage résultats
- Clic sur une opportunité
- Clic sur lien source externe
- Clic vers coaching (CTA)
- Conversion coaching (paiement)
- Clic vers Guide Premium (CTA)
- Conversion Guide Premium (souscription)
- Retour utilisateur (J+1, J+7, J+30)

## 10.2 Scoring des opportunités
- Taux de clic par opportunité
- Taux de conversion externe (clic → candidature)
- Performance des badges (top recommandé vs autres)

## 10.3 Analytics utilisateur
- Engagement (sessions, durée)
- Rétention (cohortes)
- Funnel test → résultats → coaching / Guide Premium
- Taux de conversion mensuel vs annuel (Guide Premium)
- Taux de churn (Guide Premium)

---

# 11. Données et modèle métier

## 11.1 Entités principales

**Tables Prisma (logique métier) :**
- `User`
- `TestResponse`
- `UserProfileScore`
- `Recommendation`
- `GuideSubscription` *(actif Phase 2)*
- `CheckoutSession` *(actif Phase 2)* — session de paiement Chariow avec token UUID
- `SavedOpportunity` *(actif Phase 2)* — opportunités sauvegardées par les utilisateurs
- `DeadlineAlertPreference` *(actif Phase 2)* — préférences de rappel 90/30/7j par opportunité
- `SentDeadlineAlert` *(actif Phase 2)* — historique des alertes envoyées (idempotence)
- `CoachingBooking` *(actif Phase 2)* — réservations de coaching
- `WaitlistEntry` *(actif Phase 2)* — liste d'attente Guide Premium
- `Payment` *(Phase 3 — CinetPay natif)*
- `PurchaseAccess` *(Phase 3 — CinetPay natif)*

**Tables Payload CMS (Drizzle — gérées automatiquement) :**
- `Opportunity` — catalogue complet (149+ enregistrements)
- `AdminUser` — comptes back-office

## 11.2 Champs minimaux Opportunity
- id, title, country, category, study_level, domain, funding_type
- budget_required, deadline, competitiveness_level
- eligibility_summary, source_url, short_description
- **location** *(optionnel, purement informatif)* — pays ou ville précis (ex : "France", "USA / Canada") ; sans impact sur le matching, affiché dans la modale de détail
- is_active, is_sponsored, badge_override
- created_at, updated_at

## 11.3 Valeurs de référence

### Catégories d'opportunités
| Valeur | Label |
|---|---|
| `bourse` | Bourse |
| `programme` | Programme (graduate, échange, accélérateur…) |
| `fellowship` | Fellowship ou résidence |
| `concours` | Concours ou compétition |
| `prix` | Prix ou dotation |
| `autre` | Autre type d'opportunité |

> Les offres de stage et d'emploi classiques ne sont pas incluses dans le catalogue. Seuls les programmes graduate ou structurés d'organisations reconnues sont acceptés sous la catégorie `programme`.

### Zones géographiques
| Valeur | Label |
|---|---|
| `afrique` | Afrique |
| `europe` | Europe |
| `amerique_nord` | Amérique du Nord |
| `asie` | Asie |
| `amerique_sud` | Amérique du Sud |
| `moyen_orient` | Moyen-Orient |
| `oceanie` | Océanie |
| `international` | International / Mondial |
| `peu_importe` | Peu importe *(choix utilisateur uniquement)* |

### Plafonds budget (filtre de matching)
| Valeur utilisateur | Plafond XOF |
|---|---|
| `zero` | 0 (financement 100% requis) |
| `petit` | 500 000 XOF |
| `moyen` | 2 000 000 XOF |
| `confortable` | Illimité |

### État du catalogue (au 2026-04-25)
- **149 opportunités actives** en base de données
- Distribution : bourse:77, programme:26, fellowship:12, prix:11, concours:6
- Zones : europe:45, afrique:41, amerique_nord:18, international:18, asie:8, oceanie:2

---

# 12. Règles métier

## 12.1 Règles de scoring
- Le score académique est calculé à partir du niveau déclaré.
- Le score financier dépend du budget déclaré.
- Le score de maturité dépend de la préparation du dossier et du délai projet.
- Le profil global est dérivé de ces sous-scores.

## 12.2 Règles de matching
- Filtres durs (exclusion) : catégorie, domaine, zone géographique cible, niveau académique, budget, horizon temporel, deadline expirée, inactivité.
- Tri par score de pertinence décroissant (scoring sur 100 points).
- Maximum 5 opportunités retournées (produit gratuit).
- Explication de pertinence obligatoire pour chaque résultat.
- **Exception domaine** : les opportunités taguées `multidisciplinaire` passent le filtre domaine quel que soit le domaine déclaré par l'utilisateur.
- **Scores de matching** : +30 catégorie, +25 domaine, +20 zone, +15 financement complet (si budget=zéro), +10 deadline dans 90 jours.
- **Filtre timeline** : urgent ≤ 90 j, court ≤ 180 j, moyen ≤ 365 j, long = illimité.

## 12.3 Règles d'attribution des badges
- **"🔥 Top recommandé pour toi"** : les 1 à 2 opportunités avec le score le plus élevé.
- **"🎯 Forte probabilité d'acceptation"** : opportunités avec score élevé ET utilisateur avec maturité dossier ≥ "avancé" ET niveau académique ≥ "licence".

## 12.4 Règles de rotation
- Les opportunités affichées sont rafraîchies régulièrement selon les nouvelles disponibilités dans le catalogue.
- Les opportunités expirées sont automatiquement exclues (sauf si l'horizon est compatible — voir 12.5).

## 12.5 Règles opportunités expirées
- Une opportunité expirée (deadline passée) est incluse dans les résultats uniquement si l'horizon déclaré est `moyen` ou `long`.
- Elle est affichée avec un badge spécifique "📅 Candidature fermée — surveille la prochaine édition" et une mise en forme distincte.
- Les opportunités expirées apparaissent après les actives, triées par score décroissant.

## 12.6 Règles d'accès
- **Accès aux 5 opportunités : entièrement gratuit**, sans condition de paiement.
- **Accès au catalogue élargi et au guide** : réservé aux abonnés Guide Premium actifs.
- Le coaching premium est optionnel et payant à la séance.
- Les opportunités sponsorisées sont identifiées visuellement.

## 12.7 Règles Guide Premium
- Un abonnement actif (`GuideSubscription.status = ACTIVE`) donne accès au catalogue complet, au guide interactif, aux alertes deadlines et à la newsletter.
- Un abonnement mensuel peut être résilié à tout moment ; l'accès est maintenu jusqu'à la fin de la période payée.
- Un abonnement annuel est non remboursable après 14 jours.
- L'activation est déclenchée par le retour Chariow sur `/guide/success?token=` via `CheckoutSession` (Phase 2).
- Un `CheckoutSession` est à usage unique (idempotence) et expire après 1 heure.
- En Phase 3, le webhook Chariow (`POST /api/webhooks/chariow`) prendra le relais pour les renouvellements et révocations automatiques.

## 12.8 Règles des alertes deadlines
- Les alertes deadlines sont réservées aux abonnés Guide Premium actifs.
- Trois fenêtres configurables par opportunité sauvegardée : 90 jours, 30 jours, 7 jours avant la deadline.
- Toutes les fenêtres sont activées par défaut à la sauvegarde d'une opportunité.
- Une alerte ne peut être envoyée qu'une seule fois par fenêtre par opportunité (`SentDeadlineAlert` — contrainte `UNIQUE [pref_id, days_before]`).
- Le cron tourne quotidiennement à 7h00 UTC. Une alerte se déclenche si `|daysUntil(deadline) - window| ≤ 1`.
- Les opportunités avec deadline dépassée sont ignorées.

---

# 13. Contenu et qualité des données

## 13.1 Exigences qualité
- Chaque opportunité doit provenir d'une source identifiable.
- Les deadlines doivent être vérifiées.
- Les informations critiques doivent être structurées.
- Les doublons doivent être évités.
- Les opportunités expirées doivent être désactivées.

## 13.2 Gouvernance de la donnée
- Processus d'ajout, vérification, mise à jour et retrait.
- Enrichissement semi-automatique des métadonnées.
- Historique minimum des modifications.

---

# 14. Architecture des écrans (vue produit)

## 14.1 Écrans MVP (Phase 1)
- Landing page
- Questionnaire (10 étapes)
- Connexion / inscription (après test)
- Résultats : 5 opportunités avec badges + justification
- Bloc coaching (upsell)
- Espace utilisateur simple

## 14.2 Écrans Phase 2
- Page de présentation Guide Premium (`/guide-premium`)
- Tunnel de souscription (mensuel / annuel) → redirection Chariow
- Page de confirmation post-paiement (`/guide/success`) ✅ *implémenté*
- Espace Guide Premium (`/guide`) — guide, catalogue élargi, alertes
- Pages légales : `/confidentialite`, `/conditions`, `/contact` ✅ *implémenté*

## 14.3 Écrans Phase 3
- Page coaching (offres + paiement natif)
- Dashboard utilisateur (score évolutif, historique)
- Back-office admin enrichi

## 14.4 États UI critiques
- loading, empty state, error state, success state
- no_results (aucune opportunité après filtrage)

---

# 15. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Modèle gratuit non rentable à court terme | Activer rapidement le Guide Premium et optimiser la conversion coaching |
| Faible adoption du coaching | Tester wording et positionnement ; A/B tests sur les CTAs |
| Perception de manque de volume (5 oppos gratuites) | Renforcer la perception qualité/rareté ; enrichir les explications de pertinence |
| Recommandations peu pertinentes | Améliorer le moteur de matching ; enrichir les métadonnées |
| Rétention faible | Activer les notifications dès Phase 2 ; améliorer la rotation |
| Qualité de données insuffisante | Processus éditorial rigoureux ; désactivation automatique des opportunités expirées |
| Faible conversion Guide Premium | Tester le positionnement de l'upsell ; optimiser le prix mensuel comme point d'entrée |
| Friction paiement Mobile Money élevée | Prioriser Notchpay ou FedaPay selon les retours utilisateurs ; tester sur un échantillon avant déploiement large |
| Contenu du guide perçu comme peu différenciant | Intégrer des témoignages authentiques et des bons plans exclusifs dès le lancement |
| Dépendance Lemon Squeezy (plateforme tierce) | Prévoir la migration vers Stripe/Notchpay natif en Phase 3 ; multi-canal dès le départ |
| Churn élevé sur l'abonnement mensuel | Mettre en avant l'annuelle ; montrer la valeur sur la durée (cycle candidatures 12 mois) |
| Concurrence d'autres guides ou ressources gratuites | Différenciation par la personnalisation (lié au profil KRAAK) et la qualité du catalogue |

---

# 16. Roadmap

## Phase 1 — MVP (actuel) ✅ Livré
- Landing page
- Test de profil (10 questions)
- Scoring
- Matching (max 5 opportunités, filtres durs, badges, justification)
- Accès gratuit aux résultats (auth gate)
- Bloc coaching (upsell non bloquant)
- Compte utilisateur
- Alertes email hebdomadaires (basiques)

## Phase 2 — Guide Premium & Rétention (en cours)
- **KRAAK Premium Guide** ✅ *partiellement livré*
  - Guide interactif complet (mindset, étapes, constitution dossier, bons plans, témoignages)
  - Catalogue élargi pour abonnés (149+ opportunités, filtres avancés)
  - **Alertes deadlines 90/30/7 jours** ✅ *implémenté*
  - Newsletter éditoriale *(à venir)*
- **Tunnel de souscription Chariow** (pre-checkout token) ✅ *implémenté*
- **Pages légales** (`/confidentialite`, `/conditions`, `/contact`) ✅ *implémenté*
- Notifications nouvelles opportunités *(à venir)*
- Rotation dynamique des opportunités *(à venir)*
- Tracking avancé (clics, conversions externes) *(à venir)*
- Amélioration du matching *(à venir)*
- Mise à jour du profil utilisateur *(à venir)*

## Phase 3 — Monétisation & Scale
- Webhooks Chariow natifs (renouvellements, révocations automatiques)
- Coaching premium complet (paiement natif, mise en relation, workflow automatisé)
- Intégration paiement native (CinetPay ou Notchpay) si les volumes le justifient
- Lead generation (partenariats écoles / programmes)
- Affiliation (commissions)
- Opportunités sponsorisées
- Score évolutif utilisateur
- Dashboard analytics avancé

---

# 17. Définition of Done (DoD)

Une fonctionnalité est considérée comme terminée si :
- les critères d'acceptation sont validés ;
- les cas d'erreur principaux sont gérés ;
- la sécurité minimale est respectée ;
- la journalisation minimale est en place ;
- les tests critiques passent ;
- l'UX est cohérente sur mobile ;
- la documentation minimale est fournie.

---

# 18. Open questions

## Questions générales
- Faut-il notifier par email, SMS ou push notification en priorité ?
- Quel volume minimum d'opportunités est requis pour couvrir tous les profils ?
- Comment mesurer la qualité perçue du matching (CSAT, NPS) ?
- Quelle politique de données pour les leads transmis aux partenaires ?

## Questions coaching
- Quel est le prix optimal pour le coaching premium ?
- Quelle offre coaching proposer en premier (audit dossier vs accompagnement complet) ?

## Questions Guide Premium
- ~~Lemon Squeezy ou FedaPay : lequel prioriser pour le Mobile Money au lancement ?~~ *→ Résolu : Chariow (Phase 2), CinetPay/Notchpay natif si volumes (Phase 3)*
- Le guide doit-il être accessible en ligne uniquement ou aussi en PDF téléchargeable ?
- Quelle cadence pour la newsletter éditoriale (hebdomadaire, bimensuelle) ?
- L'offre annuelle doit-elle inclure un mois d'essai gratuit pour accélérer la conversion ?
- Comment qualifier et recruter les premiers témoignages de lauréats pour alimenter le guide ?
- Faut-il afficher le Guide Premium sur la landing page ou uniquement post-résultats ?
- Chariow supporte-t-il le paramètre `?success_url=` dynamique ? *(à confirmer à réception des liens produit)*

---

# 19. Annexes produit

## 19.1 Principes directeurs
- Accès gratuit sans friction
- Qualité avant quantité (5 opportunités premium > 50 opportunités moyennes)
- Mobile-first
- Confiance et clarté
- Données de qualité
- Itération rapide
- Monétisation non bloquante

## 19.2 Principe de priorisation
Toute fonctionnalité ajoutée au MVP doit répondre positivement à au moins deux des questions suivantes :
1. Augmente-t-elle significativement l'acquisition ou la rétention ?
2. Améliore-t-elle fortement la pertinence perçue ?
3. Réduit-elle une friction majeure ?
4. Renforce-t-elle la confiance utilisateur ?
5. Contribue-t-elle à la monétisation sans bloquer l'accès gratuit ?

## Context7

Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.
