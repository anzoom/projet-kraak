## Context

Le questionnaire est la pièce centrale du parcours KRAAK. Il doit fonctionner sur smartphone en Afrique (réseau instable, appels entrants fréquents). Les réponses doivent survivre à toute interruption avant d'être persistées en base. Le questionnaire est anonyme : aucune auth n'est requise pour y répondre. À la fin, l'utilisateur est redirigé vers `/auth/register` pour créer son compte et voir ses résultats.

Les 10 questions collectent : niveau actuel, objectif principal, domaine d'intérêt, pays cible, budget, niveau académique, maturité du dossier, blocage principal, horizon temporel, disposition à investir.

## Goals / Non-Goals

**Goals:**
- Page `/test` publique avec 10 questions à choix unique
- État géré par Zustand (store client) — nécessite `'use client'`
- Persistance dans `localStorage` à chaque réponse (survie aux interruptions)
- Barre de progression visible (étape X / 10)
- Navigation avant/arrière entre questions
- Restauration automatique d'un test interrompu au rechargement
- Redirection vers `/auth/register?from=test` à la completion
- Mobile-first : grande zone tactile, une question par écran

**Non-Goals:**
- Validation côté serveur à ce stade (pure UI)
- Sauvegarde en base (fait lors du register/login)
- Questions à choix multiple ou texte libre (choix unique uniquement au MVP)
- Saut conditionnel de questions (logique d'affichage linéaire)

## Decisions

### D1 — Zustand pour l'état du questionnaire, pas useState local

Le questionnaire traverse plusieurs composants (page, stepper, question card). Zustand évite le prop drilling et rend l'état accessible depuis n'importe quel composant. Le store est synchronisé avec localStorage à chaque mutation.

Alternative rejetée : `useState` dans la page + prop drilling → fragile à mesure que la logique grandit.

### D2 — Persistance localStorage synchrone à chaque réponse

Chaque fois que l'utilisateur sélectionne une réponse, le store écrit dans `localStorage` (clé : `kraak_anonymous_session`). Pas d'attente de "submit final". Si la page se ferme entre deux questions, les réponses déjà données sont restaurées.

Alternative rejetée : `sessionStorage` → effacé à la fermeture de l'onglet, inadapté aux interruptions mobiles.

### D3 — Une question par écran avec animation de transition CSS

Sur mobile, afficher toutes les questions en scroll est cognitif lourd. Une question par écran avec transition CSS simple (translate) est plus engageante. Pas de bibliothèque d'animation (Framer Motion) — animation CSS Tailwind suffit.

### D4 — Questions définies en data statique TypeScript

Les 10 questions sont définies dans `src/data/questions.ts` comme un tableau TypeScript typé. Cela permet de les modifier sans toucher aux composants, et de les enrichir avec des explications ou des sauts conditionnels à une phase ultérieure.

### D5 — Structure de route : `src/app/(public)/test/page.tsx`

Conformément à l'architecture ARCHITECTURE.md, `/test` est une route publique dans le groupe `(public)`. La page actuelle `src/app/page.tsx` reste à la racine (landing). Un groupe `(public)` est créé pour regrouper les routes publiques futures (`/test`, `/auth/**`).

### D6 — Réponses stockées en JSON dans localStorage

Format : `{ answers: { [questionId: string]: string }, currentStep: number, startedAt: string }`. Permet la restauration complète. Vidé après création de compte + persistance en base.

## Risks / Trade-offs

- **[Risque] localStorage indisponible** (mode privé restrictif) → Mitigation : `try/catch` autour des accès localStorage, fallback sur état en mémoire uniquement
- **[Risque] Composant client lourd** → Mitigation : seul le composant `TestStepper` est `'use client'`, la page elle-même peut rester Server Component avec import dynamique
- **[Risque] Utilisateur quitte sans finir** → Mitigation : restauration automatique + message "Reprendre ton test" si session partielle détectée

## Open Questions

- Faut-il afficher un écran de "résumé" avant la redirection vers le register ? (Non pour le MVP — redirection directe)
- Les libellés des choix de réponse sont-ils définitifs ? (À valider avec le product — placeholders dans cette implémentation)
