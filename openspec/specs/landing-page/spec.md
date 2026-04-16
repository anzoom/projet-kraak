### Requirement: Proposition de valeur visible immédiatement
La landing page SHALL afficher la promesse principale de KRAAK en moins de 2 lignes, visible sans scroll sur mobile (above the fold), avec un CTA principal "Tester mon profil" accessible en un seul clic.

#### Scenario: Chargement initial sur mobile (375px)
- **WHEN** un utilisateur ouvre la landing page sur un écran de 375px de large
- **THEN** la promesse principale et le bouton CTA "Tester mon profil" sont tous les deux visibles sans scroll

#### Scenario: Clic sur le CTA principal
- **WHEN** l'utilisateur clique sur le bouton "Tester mon profil"
- **THEN** il est redirigé vers `/test` sans rechargement de page

### Requirement: Navigation principale
La page SHALL inclure une barre de navigation en haut avec le logo/nom KRAAK et un bouton secondaire "Démarrer le test", sticky sur desktop et fixe sur mobile.

#### Scenario: Logo KRAAK affiché
- **WHEN** la page est chargée
- **THEN** le nom "KRAAK" est affiché de manière proéminente dans la navbar

#### Scenario: CTA de navigation cliquable
- **WHEN** l'utilisateur clique sur le bouton de navigation "Démarrer le test"
- **THEN** il est redirigé vers `/test`

### Requirement: Section "Comment ça marche"
La page SHALL présenter le fonctionnement en 3 étapes numérotées : (1) Réponds à 10 questions, (2) KRAAK analyse ton profil, (3) Accède à tes opportunités personnalisées.

#### Scenario: Affichage des 3 étapes
- **WHEN** l'utilisateur scroll jusqu'à la section "Comment ça marche"
- **THEN** 3 étapes numérotées sont affichées avec titre et description courte pour chacune

### Requirement: Section bénéfices utilisateur
La page SHALL présenter au minimum 4 bénéfices concrets pour l'utilisateur, sous forme de liste visuelle (icône + titre + description courte).

#### Scenario: Bénéfices affichés
- **WHEN** l'utilisateur scroll jusqu'à la section des bénéfices
- **THEN** au moins 4 bénéfices sont affichés, chacun avec une icône, un titre et une description

### Requirement: Éléments de réassurance
La page SHALL inclure des éléments de réassurance pour établir la confiance : sources vérifiées, recommandations personnalisées, rapidité du processus.

#### Scenario: Section réassurance visible
- **WHEN** l'utilisateur scroll jusqu'à la section réassurance
- **THEN** au moins 3 éléments de réassurance sont affichés

### Requirement: CTA final
La page SHALL se terminer par une section CTA finale répétant la promesse principale et le bouton "Tester mon profil".

#### Scenario: CTA final présent
- **WHEN** l'utilisateur atteint le bas de la page
- **THEN** un bouton "Tester mon profil" est visible dans la section finale

### Requirement: Responsive mobile-first
La page SHALL être entièrement responsive, en priorité sur mobile (375px–428px), sans défilement horizontal, avec des textes lisibles (taille minimum 16px sur mobile) et des zones tactiles d'au minimum 44px.

#### Scenario: Pas de défilement horizontal
- **WHEN** la page est affichée sur un écran de 375px de large
- **THEN** aucun défilement horizontal n'est présent

#### Scenario: Tailles de zones tactiles
- **WHEN** la page est affichée sur mobile
- **THEN** tous les boutons et liens interactifs ont une hauteur minimum de 44px

### Requirement: Absence de mode sombre
La page SHALL s'afficher uniquement en mode clair, sans adaptation au `prefers-color-scheme: dark` du système utilisateur.

#### Scenario: Affichage en mode clair forcé
- **WHEN** l'appareil de l'utilisateur est configuré en mode sombre
- **THEN** la landing page s'affiche toujours avec le thème clair KRAAK

### Requirement: Performance de chargement
La page SHALL être un Server Component pur sans JavaScript client non nécessaire, pour garantir un chargement rapide sur les réseaux africains.

#### Scenario: Rendu serveur uniquement
- **WHEN** la page est construite avec `next build`
- **THEN** aucun composant `'use client'` n'est présent dans la landing page ou ses sections
