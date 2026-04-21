### Requirement: Navigation principale contextuelle selon session
La barre de navigation SHALL afficher des CTAs différents selon l'état de session de l'utilisateur : "Mes résultats" pour les utilisateurs connectés, "Se connecter" + "S'inscrire" pour les utilisateurs non connectés.

#### Scenario: Navbar — utilisateur connecté
- **WHEN** un utilisateur avec une session Supabase active charge la page d'accueil
- **THEN** la navbar affiche un bouton "Mes résultats" (orange) liant vers `/results`, sans bouton "Se connecter" ni "S'inscrire"

#### Scenario: Navbar — utilisateur non connecté
- **WHEN** un utilisateur sans session charge la page d'accueil
- **THEN** la navbar affiche un lien texte "Se connecter" (liant vers `/auth/login`) et un bouton orange "S'inscrire" (liant vers `/auth/register`)

### Requirement: Hero Section contextuelle selon session
La Hero Section SHALL afficher des CTAs et un message différents selon l'état de session de l'utilisateur.

#### Scenario: Hero — utilisateur connecté
- **WHEN** un utilisateur avec une session Supabase active charge la page d'accueil
- **THEN** la Hero Section affiche : bouton primaire "Voir mes résultats" (liant vers `/results`) et bouton outline "Refaire le test" (liant vers `/test`)

#### Scenario: Hero — utilisateur non connecté
- **WHEN** un utilisateur sans session charge la page d'accueil
- **THEN** la Hero Section affiche : bouton primaire "Tester mon profil" (liant vers `/test`), lien "Déjà un compte ? Se connecter" (liant vers `/auth/login`), et le compteur social "Déjà plus de 2 000 étudiants africains accompagnés"

### Requirement: Inscription prioritaire sur connexion pour les non-connectés
Les éléments de navigation de la landing page SHALL présenter l'inscription ("S'inscrire") comme action primaire et la connexion ("Se connecter") comme action secondaire pour les utilisateurs non connectés.

#### Scenario: Hiérarchie visuelle inscription > connexion
- **WHEN** un utilisateur non connecté charge la page d'accueil
- **THEN** le bouton "S'inscrire" est rendu avec le style orange primaire et "Se connecter" est rendu en style texte secondaire

### Requirement: Composants Navbar et HeroSection en Server Components
La Navbar et la HeroSection SHALL être des Server Components asynchrones utilisant `createSupabaseServerAnonClient()` pour lire la session, sans JavaScript client.

#### Scenario: Rendu serveur des composants auth-aware
- **WHEN** la page est construite avec `next build`
- **THEN** Navbar et HeroSection sont des Server Components sans directive `'use client'`
