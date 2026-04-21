## Why

Le formulaire de profil KRAAK utilisait des boutons radio pour toutes ses questions, manquait d'une question sur le pays d'origine (pourtant critère d'éligibilité clé pour le matching "Afrique hors mon pays"), et incluait une question `invest_readiness` peu discriminante. La landing page affichait les mêmes CTAs à tous les visiteurs indépendamment de leur état de connexion, créant de la confusion pour les utilisateurs déjà inscrits. La modale de détail n'offrait aucun chemin vers le coaching, laissant l'utilisateur sans alternative si l'opportunité ne lui convient pas.

## What Changes

- Ajout de `origin_country` comme première question (dropdown 9 pays CinetPay + "Autre pays africain")
- Conversion de toutes les questions radio en menus déroulants (`SelectCard` / `CountrySelectCard`)
- Suppression de la question `invest_readiness`
- Redirection conditionnelle après test : `/results` si session active, `/auth/register?from=test` sinon
- Intégration de `origin_country` dans le moteur de matching : filtre dur "afrique hors pays d'origine"
- Ajout d'un bouton "Réserver un coaching / suivi" toujours visible dans le pied de la modale de détail
- Landing page auth-aware : Navbar et HeroSection adaptés selon la session (CTAs différenciés connecté vs non-connecté)
- Hiérarchie inscription > connexion pour les visiteurs non connectés

## Capabilities

### Modified Capabilities
- `profile-test` : question origin_country Q1, dropdowns, suppression invest_readiness, redirection conditionnelle
- `matching-engine` : filtrage "afrique hors pays d'origine" via AFRICAN_COUNTRIES Set
- `results-display` : bouton coaching toujours présent dans la modale de détail
- `landing-page` : Navbar et HeroSection Server Components auth-aware

## Impact

- Fichiers modifiés :
  - `src/data/questions.ts` — nouvelle Q1 origin_country, toutes les questions en SelectCard, invest_readiness retiré
  - `src/components/features/test/TestStepper.tsx` — rendu simplifié (SelectCard / CountrySelectCard), redirection conditionnelle
  - `src/domain/matching/matcher.ts` — AFRICAN_COUNTRIES Set, filtre "afrique" avec exclusion pays d'origine
  - `src/components/features/results/OpportunityDetailModal.tsx` — footer toujours rendu, bouton coaching
  - `src/components/features/landing/Navbar.tsx` — Server Component async, CTAs session-aware
  - `src/components/features/landing/HeroSection.tsx` — Server Component async, CTAs session-aware
- Aucune migration DB requise
- Aucune variable d'environnement ajoutée
