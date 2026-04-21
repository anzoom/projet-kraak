# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Produit : KRAAK
## Version : MVP V2 — Pivot Gratuit + Coaching Premium
## Statut : Validé
## Owner : Founder / Product Lead
## Dernière mise à jour : 2026-04-21

---

# 1. Résumé exécutif

## 1.1 Vision
KRAAK est une plateforme numérique d'orientation et d'accès aux opportunités destinée en priorité aux étudiants africains. Le produit aide l'utilisateur à identifier rapidement les opportunités les plus pertinentes pour son profil (bourses, formations, programmes, emplois/stages) et à maximiser ses chances de succès.

## 1.2 Problème
Les utilisateurs cibles font face à :
- une information fragmentée et peu fiable ;
- une difficulté à savoir quelles opportunités leur correspondent réellement ;
- un manque d'accompagnement simple, rapide et abordable ;
- une forte asymétrie d'information sur les conditions d'éligibilité, les délais et la stratégie de candidature.

## 1.3 Proposition de valeur
**"Accède gratuitement aux meilleures opportunités adaptées à ton profil en quelques minutes."**

## 1.4 Pivot stratégique
Le modèle freemium avec paywall est abandonné. KRAAK devient une plateforme **entièrement gratuite** pour l'accès aux opportunités, avec une monétisation indirecte et un coaching premium optionnel. Ce pivot vise à maximiser l'acquisition, l'usage et la rétention, tout en ouvrant des revenus plus durables.

## 1.5 Objectif du MVP
Valider rapidement :
- l'intérêt utilisateur pour un accès gratuit et immédiat ;
- la qualité perçue du matching (5 opportunités ultra pertinentes) ;
- la conversion vers le coaching premium.

---

# 2. Objectifs produit

## 2.1 Objectifs business
- Maximiser l'acquisition utilisateur (accès gratuit sans friction).
- Générer des revenus via monétisation indirecte et coaching premium.
- Construire une base de données d'opportunités qualifiées et enrichies.
- Obtenir des retours utilisateurs structurés pour améliorer le matching.
- Préparer une extension vers lead generation, affiliation et opportunités sponsorisées.

## 2.2 Objectifs utilisateurs
- Accéder immédiatement à des opportunités adaptées sans payer.
- Comprendre pourquoi une opportunité est pertinente pour leur profil.
- Maximiser leurs chances d'acceptation grâce au coaching.
- Revenir régulièrement découvrir de nouvelles opportunités.

## 2.3 KPIs de succès MVP
- Taux de complétion du test > 60%
- Taux d'affichage des résultats > 80%
- Taux de clic sur une opportunité > 40%
- Taux de clic vers coaching > 15%
- Taux de conversion coaching > 5%
- Taux de retour utilisateur (J+7) > 30%
- Taux de rebond landing page < 60%

---

# 3. Portée du produit

## 3.1 In scope (MVP — Phase 1)
- Landing page
- Test de profil / orientation
- Moteur de scoring
- Matching : max 5 opportunités ultra pertinentes
- Explication de pertinence par opportunité
- Badges visuels de mise en avant
- Bloc coaching premium (upsell non bloquant)
- Compte utilisateur (authentification)
- Historique des résultats

## 3.2 In scope (Phase 2)
- Notifications (deadlines, nouvelles opportunités)
- Rotation dynamique des opportunités
- Amélioration du matching
- Tracking avancé (clics, conversions)

## 3.3 In scope (Phase 3)
- Coaching premium complet (paiement, mise en relation, workflow automatisé)
- Monétisation indirecte : lead generation, affiliation
- Opportunités sponsorisées
- Score évolutif utilisateur

## 3.4 Hors scope (MVP)
- Paywall ou paiement pour accéder aux opportunités
- Marketplace complète
- Réservation de mentors
- Messagerie temps réel
- Réseau social / communauté
- Mode hors ligne complet

---

# 4. Modèle de monétisation

## 4.1 Principe
L'accès aux opportunités est **entièrement gratuit**. La monétisation repose sur quatre piliers :

### Lead generation
Mise en relation rémunérée entre utilisateurs qualifiés et écoles, programmes ou employeurs partenaires.

### Affiliation
Redirection vers des plateformes partenaires (Campus France, établissements, etc.) avec commission sur les inscriptions ou candidatures générées.

### Opportunités sponsorisées
Mise en avant payante d'opportunités par des institutions ou programmes partenaires dans le flux de recommandations.

### Coaching premium
Accompagnement personnalisé payant déclenché après l'affichage des résultats. Objectif : maximiser les chances d'acceptation sur les opportunités proposées.

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

---

# 6. Parcours utilisateur principal

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

---

# 7. Exigences fonctionnelles

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
- Pays ou région cible
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
Afficher les 5 opportunités les plus adaptées au profil utilisateur avec une explication de pertinence.

### Exigences
- **Maximum 5 opportunités** affichées par utilisateur.
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
1. Clic CTA → page coaching
2. Choix d'offre (ex : audit dossier, accompagnement complet)
3. Paiement → mise en relation / workflow automatisé

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
5. Upsell coaching → conversion

---

## 7.9 Back-office d'administration
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

# 8. Exigences non fonctionnelles

## 8.1 Performance
- Temps de chargement initial mobile : < 3 secondes en réseau correct
- Temps de réponse API critique : < 1 seconde
- Temps de calcul du résultat : < 2 secondes après soumission

## 8.2 Disponibilité et fiabilité
- Disponibilité cible MVP : 99,5% minimum
- Gestion propre des erreurs front et back
- Journalisation des erreurs applicatives

## 8.3 Sécurité
- Chiffrement TLS pour tous les échanges
- Hash sécurisé des mots de passe
- Protection XSS, CSRF, injection, brute force
- Validation stricte des entrées utilisateur
- Contrôle d'accès basé sur les rôles
- Limitation de débit sur login / endpoints sensibles
- Secrets et clés API jamais exposés côté client

## 8.4 Protection des données personnelles
- Collecter uniquement les données nécessaires
- Informer l'utilisateur de la finalité de la collecte
- Consentement explicite pour communications marketing
- Transparence sur l'usage des données de profil

## 8.5 UX / UI
- Mobile-first
- Accès immédiat à la valeur (sans friction)
- Affichage limité mais premium (max 5 opportunités)
- Perception de qualité et de rareté
- Mise en avant intelligente des opportunités prioritaires
- Intégration naturelle et non intrusive du coaching
- États de chargement explicites
- Messages d'erreur compréhensibles

## 8.6 Automatisation
- Ingestion semi-automatique des opportunités
- Enrichissement automatique des données
- Matching automatique au chargement des résultats
- Notifications automatiques (deadlines, nouvelles offres)
- Tracking automatique des interactions (clics, conversions)

## 8.7 Scalabilité
- Architecture permettant d'ajouter de nouveaux types d'opportunités
- Possibilité d'introduire coaching, lead gen, affiliation
- Moteur de règles de scoring extensible
- Modèle de données modulaire

---

# 9. Data & Tracking

## 9.1 Événements à tracker
- Vue landing page
- Démarrage test
- Complétion test
- Affichage résultats
- Clic sur une opportunité
- Clic sur lien source externe
- Clic vers coaching (CTA)
- Conversion coaching (paiement)
- Retour utilisateur (J+1, J+7, J+30)

## 9.2 Scoring des opportunités
- Taux de clic par opportunité
- Taux de conversion externe (clic → candidature)
- Performance des badges (top recommandé vs autres)

## 9.3 Analytics utilisateur
- Engagement (sessions, durée)
- Rétention (cohortes)
- Funnel test → résultats → coaching

---

# 10. Données et modèle métier

## 10.1 Entités principales
- User
- TestResponse
- UserProfileScore
- Opportunity
- Recommendation
- CoachingLead *(Phase 3)*
- Payment *(Phase 3)*
- AnalyticsEvent

## 10.2 Champs minimaux Opportunity
- id, title, country, category, study_level, domain, funding_type
- budget_required, deadline, competitiveness_level
- eligibility_summary, source_url, short_description
- is_active, is_sponsored, badge_override
- created_at, updated_at

---

# 11. Règles métier

## 11.1 Règles de scoring
- Le score académique est calculé à partir du niveau déclaré.
- Le score financier dépend du budget déclaré.
- Le score de maturité dépend de la préparation du dossier et du délai projet.
- Le profil global est dérivé de ces sous-scores.

## 11.2 Règles de matching
- Filtres durs (exclusion) : catégorie, domaine, pays cible, niveau académique, budget, horizon temporel, deadline expirée, inactivité.
- Tri par score de pertinence décroissant.
- Maximum 5 opportunités retournées.
- Explication de pertinence obligatoire pour chaque résultat.

## 11.3 Règles d'attribution des badges
- **"🔥 Top recommandé pour toi"** : les 1 à 2 opportunités avec le score le plus élevé.
- **"🎯 Forte probabilité d'acceptation"** : opportunités avec score élevé ET utilisateur avec maturité dossier ≥ "avancé" ET niveau académique ≥ "licence".

## 11.4 Règles de rotation
- Les opportunités affichées sont rafraîchies régulièrement selon les nouvelles disponibilités dans le catalogue.
- Les opportunités expirées sont automatiquement exclues.

## 11.5 Règles d'accès
- **Accès aux opportunités : entièrement gratuit**, sans condition de paiement.
- Le coaching premium est optionnel et payant.
- Les opportunités sponsorisées sont identifiées visuellement.

---

# 12. Contenu et qualité des données

## 12.1 Exigences qualité
- Chaque opportunité doit provenir d'une source identifiable.
- Les deadlines doivent être vérifiées.
- Les informations critiques doivent être structurées.
- Les doublons doivent être évités.
- Les opportunités expirées doivent être désactivées.

## 12.2 Gouvernance de la donnée
- Processus d'ajout, vérification, mise à jour et retrait.
- Enrichissement semi-automatique des métadonnées.
- Historique minimum des modifications.

---

# 13. Architecture des écrans (vue produit)

## 13.1 Écrans MVP (Phase 1)
- Landing page
- Questionnaire (10 étapes)
- Connexion / inscription (après test)
- Résultats : 5 opportunités avec badges + justification
- Bloc coaching (upsell)
- Espace utilisateur simple

## 13.2 Écrans Phase 3
- Page coaching (offres + paiement)
- Dashboard utilisateur (score évolutif, historique)
- Back-office admin enrichi

## 13.3 États UI critiques
- loading, empty state, error state, success state
- no_results (aucune opportunité après filtrage)

---

# 14. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Modèle gratuit non rentable à court terme | Optimiser rapidement la conversion coaching ; introduire lead gen dès Phase 2 |
| Faible adoption du coaching | Tester wording et positionnement ; A/B tests sur les CTAs |
| Perception de manque de volume (5 oppos) | Renforcer la perception qualité/rareté ; enrichir les explications de pertinence |
| Recommandations peu pertinentes | Améliorer le moteur de matching ; enrichir les métadonnées |
| Rétention faible | Activer les notifications dès Phase 2 ; améliorer la rotation |
| Qualité de données insuffisante | Processus éditorial rigoureux ; désactivation automatique des opportunités expirées |

---

# 15. Roadmap

## Phase 1 — MVP (actuel)
- Landing page
- Test de profil (10 questions)
- Scoring
- Matching (max 5 opportunités, filtres durs, badges, justification)
- Accès gratuit aux résultats (auth gate)
- Bloc coaching (upsell non bloquant)
- Compte utilisateur

## Phase 2 — Rétention & Tracking
- Notifications intelligentes (deadlines, nouvelles offres)
- Rotation dynamique des opportunités
- Tracking avancé (clics, conversions externes)
- Amélioration du matching (feedbacks utilisateur)
- Mise à jour du profil utilisateur

## Phase 3 — Monétisation & Scale
- Coaching premium (paiement, mise en relation, workflow automatisé)
- Lead generation (partenariats écoles / programmes)
- Affiliation (commissions)
- Opportunités sponsorisées
- Score évolutif utilisateur
- Dashboard analytics avancé

---

# 16. Définition of Done (DoD)

Une fonctionnalité est considérée comme terminée si :
- les critères d'acceptation sont validés ;
- les cas d'erreur principaux sont gérés ;
- la sécurité minimale est respectée ;
- la journalisation minimale est en place ;
- les tests critiques passent ;
- l'UX est cohérente sur mobile ;
- la documentation minimale est fournie.

---

# 17. Open questions

- Quel est le prix optimal pour le coaching premium ?
- Quelle offre coaching proposer en premier (audit dossier vs accompagnement complet) ?
- Faut-il notifier par email, SMS ou push notification en priorité ?
- Quel volume minimum d'opportunités est requis pour couvrir tous les profils ?
- Comment mesurer la qualité perçue du matching (CSAT, NPS) ?
- Quelle politique de données pour les leads transmis aux partenaires ?

---

# 18. Annexes produit

## 18.1 Principes directeurs
- Accès gratuit sans friction
- Qualité avant quantité (5 opportunités premium > 50 opportunités moyennes)
- Mobile-first
- Confiance et clarté
- Données de qualité
- Itération rapide
- Monétisation non bloquante

## 18.2 Principe de priorisation
Toute fonctionnalité ajoutée au MVP doit répondre positivement à au moins deux des questions suivantes :
1. Augmente-t-elle significativement l'acquisition ou la rétention ?
2. Améliore-t-elle fortement la pertinence perçue ?
3. Réduit-elle une friction majeure ?
4. Renforce-t-elle la confiance utilisateur ?
5. Contribue-t-elle à la monétisation sans bloquer l'accès gratuit ?

## Context7

Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.
