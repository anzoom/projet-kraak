## ADDED Requirements

### Requirement: Page liste des modules du guide (publique)
La page `/guide` SHALL être accessible sans authentification et afficher la liste des 9 modules du guide avec leur titre, icône et une description courte. Un CTA "Obtenir le Guide Premium" SHALL être affiché et pointer vers `/guide-premium`.

#### Scenario: Affichage de la liste pour un visiteur non connecté
- **WHEN** un visiteur non authentifié accède à `/guide`
- **THEN** la liste des 9 modules est affichée avec titre, icône et description, et le CTA pointe vers `/guide-premium`

#### Scenario: Affichage de la liste pour un utilisateur connecté gratuit
- **WHEN** un utilisateur authentifié sans GuideSubscription active accède à `/guide`
- **THEN** la liste des 9 modules est affichée, chaque module ayant un lien vers `/guide/[slug]`

#### Scenario: Affichage de la liste pour un utilisateur premium
- **WHEN** un utilisateur avec GuideSubscription active accède à `/guide`
- **THEN** la liste des 9 modules est affichée avec un badge ou indicateur visuel indiquant l'accès complet

### Requirement: Page contenu d'un module (gate serveur)
La page `/guide/[slug]` SHALL afficher le contenu d'un module du guide avec un gate d'accès côté serveur. Les visiteurs non authentifiés et les utilisateurs sans GuideSubscription active SHALL recevoir uniquement un aperçu (2 à 3 premiers paragraphes du module). Les abonnés Guide Premium SHALL recevoir le contenu complet du module.

#### Scenario: Contenu complet affiché pour un abonné premium
- **WHEN** un utilisateur avec GuideSubscription active accède à `/guide/mindset`
- **THEN** le contenu complet du module est affiché sans restriction

#### Scenario: Aperçu affiché pour un utilisateur gratuit connecté
- **WHEN** un utilisateur authentifié sans GuideSubscription active accède à `/guide/mindset`
- **THEN** les 2-3 premiers paragraphes sont affichés, suivis d'un bloc CTA "Accéder au guide complet" pointant vers `/guide-premium`

#### Scenario: Aperçu affiché pour un visiteur non connecté
- **WHEN** un visiteur non authentifié accède à `/guide/mindset`
- **THEN** les 2-3 premiers paragraphes sont affichés, suivis d'un bloc CTA avec deux actions : "Créer un compte" (vers `/auth/register`) et "Se connecter" (vers `/auth/login`)

#### Scenario: Module inexistant — page 404
- **WHEN** l'utilisateur accède à `/guide/slug-inexistant`
- **THEN** une page 404 est retournée sans erreur serveur

#### Scenario: Navigation entre modules
- **WHEN** un utilisateur premium est sur la page d'un module
- **THEN** des liens "Module précédent" et "Module suivant" sont affichés pour naviguer dans l'ordre des modules

### Requirement: Lien Guide dans la navigation des pages connectées
Le menu `ResultsHeaderMenu` SHALL afficher un lien vers `/guide` pour les utilisateurs authentifiés.

#### Scenario: Lien Guide visible dans le menu profil
- **WHEN** un utilisateur authentifié ouvre le dropdown "Mon profil" sur `/results`
- **THEN** un lien "Guide" est visible dans le menu et navigue vers `/guide`
