## Context

Le formulaire KRAAK est un stepper 10 questions géré par `useTestStore` (Zustand). Chaque question est rendue par `TestStepper.tsx` qui dispatche vers le bon composant selon le `question.id`. Le moteur de matching (`matcher.ts`) applique des filtres durs (category, domain, country, study_level, deadline) puis un scoring additif. La landing page est composée de Server Components Next.js 14 (`Navbar`, `HeroSection`) qui peuvent lire la session Supabase côté serveur via `createSupabaseServerAnonClient()`.

## Goals / Non-Goals

**Goals:**
- Capturer le pays d'origine dès Q1 pour améliorer la pertinence du matching "Afrique hors mon pays"
- Uniformiser l'UX du formulaire en dropdowns (meilleure ergonomie mobile)
- Simplifier le parcours post-test selon l'état d'authentification
- Offrir un chemin vers le coaching depuis la modale de détail
- Différencier l'expérience landing pour les utilisateurs connectés vs non-connectés

**Non-Goals:**
- Ajouter de nouvelles questions au formulaire
- Modifier le scoring additif (bonus/malus existants conservés)
- Implémenter la page `/coaching` (lien uniquement)
- Modifier le paywall ou la logique d'accès aux résultats

## Decisions

### D1 — 9 pays CinetPay + "Autre pays africain" pour origin_country
**Décision :** Limiter la liste origin_country aux 9 pays supportés par CinetPay (Bénin, Burkina Faso, Cameroun, Côte d'Ivoire, Guinée, Mali, RD Congo, Sénégal, Togo) + une option "Autre pays africain".
**Rationale :** Cohérence avec le périmètre de paiement Mobile Money. L'option "Autre" capture les autres pays africains sans exploser la liste.

### D2 — Rendu uniforme SelectCard sauf target_country
**Décision :** `TestStepper` rend `CountrySelectCard` pour `target_country` et `SelectCard` pour toutes les autres questions, y compris la nouvelle `origin_country`.
**Rationale :** `target_country` a besoin d'une liste dynamique chargée depuis `/api/countries`. Les autres questions ont des options statiques — `SelectCard` suffit.

### D3 — Redirection conditionnelle post-test côté client
**Décision :** Dans `handleNext()` de `TestStepper`, appeler `supabase.auth.getSession()` au clic sur "Voir mes résultats" et router vers `/results` ou `/auth/register?from=test` selon la session.
**Rationale :** Le TestStepper est un Client Component — la session Supabase est disponible via `createSupabaseBrowserClient()` sans besoin de Server Action.

### D4 — Filtre dur "afrique" avec exclusion AFRICAN_COUNTRIES
**Décision :** Pour `target_country = "afrique"`, une opportunité est incluse si et seulement si son `country` ∈ AFRICAN_COUNTRIES (ou `"afrique"`) ET son `country` ≠ `origin_country`.
**Rationale :** Exclure le pays d'origine correspond à l'intention "partir en Afrique hors de chez moi". Les opportunités génériques `country: "afrique"` restent toujours incluses.

### D5 — Navbar et HeroSection convertis en Server Components async
**Décision :** `Navbar` et `HeroSection` deviennent des Server Components `async` utilisant `createSupabaseServerAnonClient()` pour lire la session.
**Rationale :** Zéro JavaScript client pour la détection de session — rendu serveur direct, conforme à l'architecture Next.js 14 App Router du projet.

### D6 — Inscription prioritaire sur connexion pour les non-connectés
**Décision :** Dans la Navbar, le bouton orange primaire pointe vers `/auth/register` (S'inscrire) et le lien texte secondaire vers `/auth/login` (Se connecter).
**Rationale :** L'objectif MVP est la conversion — un nouveau visiteur doit créer un compte. La connexion est une action secondaire pour ceux qui ont déjà un compte.

## Risks / Trade-offs

- **origin_country = "autre"** → Dans le matching, `opp.country !== "autre"` sera toujours vrai pour les pays spécifiques, donc les opportunités africaines seront toutes incluses pour les utilisateurs "Autre pays africain". Comportement acceptable pour le MVP.
- **Session SSR sur landing** → Si Supabase est indisponible, `getSession()` peut lever une erreur. Le client Supabase anon est tolérant aux erreurs réseau — la page dégradée affichera les CTAs non-connectés par défaut.
- **Invest_readiness supprimée** → Les données historiques de test qui incluaient cette question deviennent partiellement incompatibles. Acceptable car aucune donnée de production existante.
