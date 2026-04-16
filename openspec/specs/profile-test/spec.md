### Requirement: Questionnaire 10 questions
La page `/test` SHALL afficher un questionnaire de 10 questions à choix unique, une question par écran, dans un ordre fixe et linéaire.

#### Scenario: Affichage de la première question
- **WHEN** l'utilisateur navigue vers `/test` sans session existante
- **THEN** la première question est affichée avec ses options de réponse et la barre de progression à l'étape 1/10

#### Scenario: Sélection d'une réponse
- **WHEN** l'utilisateur sélectionne une option de réponse
- **THEN** l'option est visuellement sélectionnée et le bouton "Suivant" devient actif

### Requirement: Barre de progression
La page SHALL afficher une barre de progression indiquant l'étape courante sur 10 à chaque question.

#### Scenario: Progression à chaque étape
- **WHEN** l'utilisateur passe à la question N
- **THEN** la barre de progression affiche N/10 et la largeur de la barre remplie correspond à N÷10

### Requirement: Navigation avant/arrière
Le questionnaire SHALL permettre à l'utilisateur de revenir à la question précédente sans perdre sa réponse déjà donnée.

#### Scenario: Retour à la question précédente
- **WHEN** l'utilisateur est à la question N > 1 et clique sur "Précédent"
- **THEN** la question N-1 s'affiche avec la réponse précédemment sélectionnée déjà cochée

#### Scenario: Pas de retour à la première question
- **WHEN** l'utilisateur est à la question 1
- **THEN** le bouton "Précédent" est absent ou désactivé

### Requirement: Persistance localStorage
Le questionnaire SHALL sauvegarder les réponses dans `localStorage` (clé : `kraak_anonymous_session`) après chaque réponse sélectionnée.

#### Scenario: Sauvegarde automatique
- **WHEN** l'utilisateur sélectionne une réponse
- **THEN** `localStorage.getItem('kraak_anonymous_session')` contient les réponses à jour incluant cette réponse

#### Scenario: Accès localStorage indisponible
- **WHEN** `localStorage` lève une exception (mode privé restrictif)
- **THEN** le questionnaire fonctionne en mémoire sans planter

### Requirement: Restauration d'une session interrompue
La page `/test` SHALL détecter une session partielle dans `localStorage` et proposer de la reprendre.

#### Scenario: Reprise d'un test interrompu
- **WHEN** l'utilisateur ouvre `/test` et `localStorage` contient une session avec des réponses partielles
- **THEN** le questionnaire reprend à la première question sans réponse (ou à la dernière étape atteinte)

#### Scenario: Pas de session existante
- **WHEN** l'utilisateur ouvre `/test` et `localStorage` ne contient pas de session
- **THEN** le questionnaire démarre depuis la question 1

### Requirement: Complétion et redirection
À la validation de la 10ème réponse, le système SHALL vider la session partielle du store et rediriger l'utilisateur vers `/auth/register?from=test`.

#### Scenario: Test complété
- **WHEN** l'utilisateur répond à la question 10 et clique sur "Voir mes résultats"
- **THEN** il est redirigé vers `/auth/register?from=test`

#### Scenario: Données conservées pour l'auth
- **WHEN** la redirection vers `/auth/register?from=test` se produit
- **THEN** `localStorage` contient encore toutes les 10 réponses (elles seront lues lors de la création de compte)

### Requirement: Interface mobile-first
Chaque question SHALL être affichée sur un écran dédié avec des zones tactiles d'au minimum 44px pour chaque option, sans défilement horizontal.

#### Scenario: Zone tactile des options
- **WHEN** la page est affichée sur mobile (375px)
- **THEN** chaque option de réponse a une hauteur minimum de 44px et est cliquable sur toute sa surface

#### Scenario: Pas de défilement horizontal
- **WHEN** la page `/test` est affichée sur un écran de 375px
- **THEN** aucun défilement horizontal n'est présent

### Requirement: Accessibilité clavier et sémantique
Les options de réponse SHALL être implémentées avec des éléments sémantiques (radio inputs ou boutons avec rôle approprié) navigables au clavier.

#### Scenario: Navigation clavier
- **WHEN** l'utilisateur utilise la touche Tab pour naviguer
- **THEN** chaque option de réponse est focusable et sélectionnable avec Espace ou Entrée
