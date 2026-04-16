# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Produit : KRAAK
## Version : MVP V1+
## Statut : Draft de cadrage produit
## Owner : Founder / Product Lead
## Dernière mise à jour : 2026

---

# 1. Résumé exécutif

## 1.1 Vision
KRAAK est une plateforme numérique d’orientation et d’accès aux opportunités destinée en priorité aux étudiants africains. Le produit aide l’utilisateur à identifier rapidement les opportunités les plus pertinentes pour son profil (bourses, formations, programmes, emplois/stages selon phase produit) et à passer à l’action.

## 1.2 Problème
Les utilisateurs cibles font face à :
- une information fragmentée et peu fiable ;
- une difficulté à savoir quelles opportunités leur correspondent réellement ;
- un manque d’accompagnement simple, rapide et abordable ;
- une forte asymétrie d’information sur les conditions d’éligibilité, les délais et la stratégie de candidature.

## 1.3 Proposition de valeur
“Trouve les opportunités les plus adaptées à ton profil en quelques minutes.”

## 1.4 Objectif du MVP
Valider rapidement :
- l’intérêt utilisateur ;
- la capacité de KRAAK à produire des recommandations perçues comme utiles ;
- la volonté de payer pour débloquer l’accès complet aux opportunités personnalisées.

---

# 2. Objectifs produit

## 2.1 Objectifs business
- Générer les premiers revenus.
- Valider une proposition de valeur claire.
- Construire une première base de données d’opportunités qualifiées.
- Obtenir des retours utilisateurs structurés.
- Préparer une extension future vers mentorat, accompagnement et marketplace éducative.

## 2.2 Objectifs utilisateurs
- Comprendre rapidement leur profil.
- Obtenir des recommandations personnalisées.
- Gagner du temps dans la recherche d’opportunités.
- Avoir un plan d’action simple et concret.

## 2.3 KPIs de succès MVP
- Taux de complétion du test > 60%
- Taux de passage au paywall > 40%
- Taux de conversion payant > 5%
- Temps moyen pour obtenir un résultat < 3 minutes
- Taux de satisfaction initiale (CSAT) > 4/5
- Taux de rebond landing page < 60%

---

# 3. Portée du produit

## 3.1 In scope (MVP)
- Landing page
- Test de profil / orientation
- Moteur de scoring
- Recommandations d’opportunités personnalisées
- Paywall freemium
- Paiement
- Accès complet après paiement
- Historique minimum des résultats
- Back-office simple d’administration des opportunités

## 3.2 Hors scope (MVP)
- Marketplace complète
- Réservation de mentors
- Logement étudiant
- Espace parent complet
- Messagerie temps réel
- Réseau social / communauté
- Algorithmes avancés d’IA générative en production critique
- Mode hors ligne complet

---

# 4. Personas et utilisateurs cibles

## 4.1 Persona principal
### Étudiant ambitieux
- Âge : 16–28 ans
- Localisation : Afrique francophone en priorité
- Usage dominant : smartphone
- Objectif : bourse, formation, mobilité académique, évolution professionnelle
- Contraintes : temps limité, budget limité, incertitude, besoin de simplicité

## 4.2 Persona secondaire
### Jeune diplômé en repositionnement
- Cherche une formation, un programme, un stage ou une passerelle internationale
- Attentif au retour sur investissement
- Besoin de recommandations ciblées et fiables

---

# 5. Hypothèses produit

- Les utilisateurs perçoivent une forte valeur dans la personnalisation.
- Un test court augmente l’engagement plus qu’un moteur de recherche vide.
- Les utilisateurs sont prêts à payer un faible montant pour gagner du temps et obtenir des opportunités adaptées.
- Une UX mobile-first est indispensable.
- La confiance (clarté, preuves, qualité des données) est un facteur critique de conversion.

---

# 6. Parcours utilisateur principal

1. L’utilisateur arrive sur la landing page.
2. Il comprend la promesse du produit.
3. Il clique sur “Tester mon profil”.
4. Il répond au questionnaire.
5. Le système calcule son profil.
6. L’utilisateur voit un aperçu de ses résultats.
7. Un paywall lui propose l’accès complet.
8. Il paie.
9. Il débloque toutes ses opportunités et son plan d’action.
10. Il peut revenir consulter ses résultats.

---

# 7. Exigences fonctionnelles

## 7.1 Landing page
### Objectif
Expliquer clairement la valeur du produit et pousser au démarrage du test.

### Exigences
- Présenter la promesse principale en moins de 2 lignes.
- Afficher un CTA principal visible immédiatement.
- Présenter les bénéfices utilisateur.
- Inclure des éléments de réassurance.
- Être optimisée pour mobile.

### Critères d’acceptation
- Le CTA principal est visible sans scroll sur mobile.
- Le temps de compréhension de la proposition de valeur est inférieur à 10 secondes.
- L’utilisateur peut démarrer le test en un clic.

---

## 7.2 Test de profil
### Objectif
Qualifier rapidement l’utilisateur et collecter les informations nécessaires au scoring.

### Exigences
- Le test comprend 10 questions maximum.
- Les questions sont principalement à choix simple.
- Une barre de progression doit être visible.
- L’utilisateur doit pouvoir naviguer entre les étapes si nécessaire.
- Le temps moyen de complétion doit rester inférieur à 2 minutes.

### Données collectées
- Niveau actuel
- Objectif principal
- Domaine d’intérêt
- Pays cible
- Budget
- Niveau académique
- Maturité du dossier
- Blocage principal
- Horizon temporel
- Disposition à investir

### Critères d’acceptation
- L’utilisateur peut terminer le test sans créer de compte si le produit retient ce choix.
- Les réponses sont persistées.
- Le système peut relancer ou restaurer un test interrompu si l’architecture le permet.

---

## 7.3 Scoring
### Objectif
Transformer les réponses en profil utilisateur exploitable.

### Exigences
- Le moteur calcule un score académique, financier et de maturité.
- Le moteur classe l’utilisateur dans un segment de profil.
- Les règles doivent être modifiables sans refonte majeure du produit.
- Le système doit produire des explications compréhensibles.

### Critères d’acceptation
- Chaque résultat repose sur des règles traçables.
- Le système peut expliquer au moins une partie de la recommandation.
- Le calcul est déterministe sur un même jeu de réponses.

---

## 7.4 Recommandations d’opportunités
### Objectif
Afficher les opportunités les plus adaptées au profil utilisateur.

### Exigences
- Chaque opportunité doit comporter des métadonnées structurées :
  - titre
  - pays
  - type
  - niveau
  - budget requis
  - deadline
  - difficulté
  - lien source
  - description synthétique
- Le moteur de matching doit filtrer et trier les opportunités.
- Le système doit afficher pourquoi l’opportunité est pertinente pour l’utilisateur.

### Critères d’acceptation
- L’utilisateur voit 2 à 3 opportunités en aperçu.
- Des opportunités supplémentaires sont visibles mais verrouillées.
- Chaque opportunité affichée possède une justification.

---

## 7.5 Paywall
### Objectif
Monétiser l’accès complet.

### Exigences
- Afficher clairement la valeur obtenue après paiement.
- Afficher le prix de manière explicite.
- Afficher le mode de paiement disponible.
- Inclure éléments de réassurance et d’urgence modérée.
- Être optimisé pour mobile.

### Critères d’acceptation
- Le bouton principal est unique et clair.
- Le prix est affiché sans ambiguïté.
- Le contenu débloqué est perçu comme concret et utile.

---

## 7.6 Paiement
### Objectif
Permettre un paiement simple et sécurisé.

### Exigences
- Support du Mobile Money en priorité.
- Confirmation du paiement côté système.
- Déblocage automatique des résultats après succès.
- Gestion des erreurs de paiement.
- Historisation minimale des transactions.

### Critères d’acceptation
- Un paiement validé déclenche l’accès complet.
- Un paiement échoué n’accorde pas l’accès.
- L’utilisateur reçoit une confirmation.

---

## 7.7 Compte utilisateur / accès
### Objectif
Permettre à l’utilisateur de retrouver ses résultats et achats.

### Exigences
- Création de compte possible avant ou après paiement selon stratégie retenue.
- Connexion / déconnexion.
- Réinitialisation de mot de passe.
- Historique minimum des résultats.
- Accès à ses achats / droits d’accès.

### Critères d’acceptation
- L’utilisateur authentifié retrouve ses données.
- Les données d’un utilisateur ne sont jamais exposées à un autre.

---

## 7.8 Back-office d’administration
### Objectif
Permettre à l’équipe de gérer les opportunités et de superviser l’application.

### Exigences
- CRUD opportunités
- Publication / dépublication
- Gestion des métadonnées
- Suivi basique des paiements
- Consultation des KPIs principaux
- Gestion des contenus marketing minimum

### Critères d’acceptation
- Un admin peut ajouter et modifier une opportunité sans intervention technique.
- Une opportunité peut être désactivée immédiatement.

---

# 8. Exigences non fonctionnelles

## 8.1 Performance
### Objectifs
- Temps de chargement initial mobile : idéalement < 3 secondes en réseau correct
- Temps de réponse API critique : < 1 seconde pour les opérations standard
- Temps de calcul du résultat : < 2 secondes après soumission
- Interaction fluide sur appareils moyens de gamme

### Exigences
- Minimiser la taille des ressources critiques.
- Optimiser les images et médias.
- Limiter les appels réseau inutiles.
- Prévoir une stratégie de cache adaptée aux données non sensibles.
- Dégrader proprement en cas de faible connectivité.

---

## 8.2 Disponibilité et fiabilité
### Objectifs
- Disponibilité cible MVP : 99,5% minimum
- Tolérance raisonnable aux erreurs temporaires

### Exigences
- Gestion propre des erreurs front et back
- Pages d’erreur compréhensibles
- Reprise sur incident
- Journalisation des erreurs applicatives
- Monitoring des endpoints critiques

---

## 8.3 Sécurité
### Objectifs
Protéger les comptes, paiements et données personnelles.

### Exigences
- Chiffrement TLS pour tous les échanges
- Hash sécurisé des mots de passe
- Gestion de sessions sécurisée
- Protection contre les attaques courantes :
  - XSS
  - CSRF
  - injection
  - brute force
- Validation stricte des entrées utilisateur
- Contrôle d’accès basé sur les rôles
- Journalisation des événements de sécurité critiques
- Limitation de débit sur login / endpoints sensibles
- Stockage minimal des données sensibles
- Jamais de stockage direct d’informations de paiement non nécessaires si un PSP est utilisé

### Critères d’acceptation
- Un utilisateur non autorisé ne peut accéder aux données d’un autre.
- Les secrets et clés API ne sont jamais exposés côté client.
- Les endpoints critiques exigent authentification et autorisation.

---

## 8.4 Protection des données personnelles
### Exigences
- Collecter uniquement les données nécessaires.
- Informer l’utilisateur de la finalité de la collecte.
- Permettre l’accès, la rectification et la suppression des données selon politique retenue.
- Définir une politique de conservation des données.
- Prévoir une politique de confidentialité claire.
- Gérer le consentement si analytics non essentiels ou communications marketing.

### Considérations réglementaires
- Se rapprocher des principes RGPD si utilisateurs UE/diaspora
- Prévoir adaptation aux réglementations locales applicables
- Consentement explicite pour communications marketing
- Transparence sur l’usage des données de profil et recommandations

---

## 8.5 Conformité paiements
### Exigences
- Utiliser un prestataire conforme aux standards applicables
- Gérer les preuves de transaction
- Afficher conditions de remboursement / non-remboursement selon politique produit
- Assurer traçabilité minimale des transactions

---

## 8.6 UX / UI
### Objectifs
- Simplicité extrême
- Compréhension immédiate
- Réduction maximale de la friction

### Exigences
- Mobile-first
- Design accessible et lisible
- CTA visibles et hiérarchisés
- Cohérence visuelle
- États de chargement explicites
- États vides utiles
- Messages d’erreur compréhensibles
- Copywriting orienté action et confiance
- Parcours utilisateur sans surcharge cognitive

### Accessibilité minimale
- Contrastes lisibles
- Taille de texte suffisante
- Navigation clavier sur web si applicable
- Labels explicites pour champs et actions

---

## 8.7 Scalabilité
### Exigences
- Architecture permettant d’ajouter de nouveaux types d’opportunités
- Possibilité d’introduire ultérieurement mentorat, marketplace, parent dashboard
- Moteur de règles de scoring extensible
- Modèle de données modulaire

---

## 8.8 Maintenabilité
### Exigences
- Code structuré et documenté
- Séparation claire responsabilités front/back
- Convention de nommage
- Configurations externalisées
- Logs compréhensibles
- Documentation minimale de déploiement et exploitation

---

## 8.9 Testabilité
### Exigences
- Couverture des cas critiques
- Tests unitaires sur logique métier clé
- Tests d’intégration sur paiement et scoring
- Scénarios E2E sur parcours principal
- Environnement de staging

---

## 8.10 Observabilité
### Exigences
- Logs applicatifs
- Tracking des erreurs
- Analytics produit :
  - vue landing
  - démarrage test
  - complétion test
  - affichage paywall
  - clic paiement
  - succès paiement
- Dashboard minimum des métriques

---

# 9. Données et modèle métier

## 9.1 Entités principales
- User
- TestResponse
- UserProfileScore
- Opportunity
- Recommendation
- Payment
- PurchaseAccess
- AdminUser
- AnalyticsEvent

## 9.2 Champs minimaux Opportunity
- id
- title
- country
- category
- study_level
- domain
- funding_type
- budget_required
- deadline
- competitiveness_level
- eligibility_summary
- source_url
- short_description
- is_active
- created_at
- updated_at

---

# 10. Règles métier

## 10.1 Règles de scoring
- Le score académique est calculé à partir du niveau déclaré.
- Le score financier dépend du budget déclaré.
- Le score de maturité dépend de la préparation du dossier et du délai projet.
- Le profil global est dérivé de ces sous-scores.

## 10.2 Règles de matching
- Les opportunités incompatibles avec le niveau sont exclues.
- Les opportunités incompatibles avec la contrainte budgétaire sont dépriorisées ou exclues selon règles.
- Les opportunités proches du domaine et du pays cible sont priorisées.
- Les opportunités proches de la deadline peuvent être boostées si elles restent réalistes.

## 10.3 Règles d’accès
- Sans paiement, l’utilisateur voit un aperçu limité.
- Après paiement validé, l’utilisateur accède au contenu complet lié à l’offre achetée.
- Les accès expirent ou non selon le modèle retenu.

---

# 11. Contenu et qualité des données

## 11.1 Exigences qualité
- Chaque opportunité doit provenir d’une source identifiable.
- Les deadlines doivent être vérifiées.
- Les informations critiques doivent être structurées et non seulement en texte libre.
- Les doublons doivent être évités.
- Les opportunités expirées doivent être désactivées.

## 11.2 Gouvernance de la donnée
- Processus d’ajout, vérification, mise à jour et retrait
- Historique minimum des modifications
- Responsable de validation éditoriale si équipe disponible

---

# 12. Architecture des écrans (vue produit)

## 12.1 Écrans MVP
- Landing page
- Questionnaire
- Résultats partiels
- Paywall
- Paiement
- Résultats complets
- Connexion / inscription
- Espace utilisateur simple
- Back-office admin simple

## 12.2 États UI critiques
- loading
- empty state
- error state
- success state
- payment pending
- payment success
- payment failed

---

# 13. Copywriting produit clé

## 13.1 Landing
- Promesse claire
- Bénéfice concret
- CTA unique

## 13.2 Paywall
- Nombre d’opportunités trouvées
- Explication de la valeur
- Prix clair
- Réassurance sécurité
- Urgence modérée
- CTA fort

---

# 14. Risques et mitigations

## Risque : faible confiance
### Mitigation
- preuve sociale
- transparence des sources
- design rassurant
- politique claire

## Risque : recommandations peu pertinentes
### Mitigation
- améliorer taxonomie
- enrichir métadonnées
- ajuster règles de scoring

## Risque : conversion faible
### Mitigation
- tester le prix
- améliorer le paywall
- simplifier le test
- ajouter contenu de valeur perçue

## Risque : qualité de données insuffisante
### Mitigation
- processus éditorial
- revue régulière
- désactivation des opportunités expirées

---

# 15. Roadmap indicative

## Phase 0 — Cadrage
- Finaliser PRD
- Définir taxonomie des opportunités
- Définir règles de scoring
- Préparer contenus initiaux

## Phase 1 — MVP
- Landing
- Test
- Scoring
- Recommandations
- Paywall
- Paiement
- Historique simple
- Admin simple

## Phase 2 — Optimisation
- A/B tests landing et paywall
- Analytics avancées
- Feedback utilisateur
- Amélioration matching

## Phase 3 — Extension
- Mentorat
- Accompagnement premium
- Marketplace éducative
- Espace parent

---

# 16. Définition of Done (DoD)

Une fonctionnalité est considérée comme terminée si :
- les critères d’acceptation sont validés ;
- les cas d’erreur principaux sont gérés ;
- la sécurité minimale est respectée ;
- la journalisation minimale est en place ;
- les tests critiques passent ;
- l’UX est cohérente sur mobile ;
- la documentation minimale est fournie.

---

# 17. Open questions

- Le compte est-il obligatoire avant test ou après paiement ?
- Le paiement donne-t-il accès unique, durable ou limité dans le temps ?
- Quel niveau de personnalisation textuelle est souhaité au MVP ?
- Quelle politique de remboursement adopter ?
- Quel volume minimum d’opportunités est requis pour un lancement crédible ?
- Faut-il inclure dès le MVP un e-mail ou WhatsApp de suivi après achat ?

---

# 18. Annexes produit

## 18.1 Principes directeurs
- Simplicité avant exhaustivité
- Valeur avant complexité
- Mobile-first
- Confiance et clarté
- Données de qualité
- Itération rapide

## 18.2 Principe de priorisation
Toute fonctionnalité ajoutée au MVP doit répondre positivement à au moins deux des questions suivantes :
1. Augmente-t-elle significativement la conversion ?
2. Améliore-t-elle fortement la pertinence perçue ?
3. Réduit-elle une friction majeure ?
4. Renforce-t-elle la confiance utilisateur ?
5. Est-elle indispensable au paiement ou à la délivrance de valeur ?

## Context7

Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.