## 1. Types et données

- [x] 1.1 Créer `src/types/test.ts` : types `Question`, `QuestionOption`, `TestAnswers`, `TestSession`
- [x] 1.2 Créer `src/data/questions.ts` : les 10 questions KRAAK avec id, texte, options (niveau, objectif, domaine, pays cible, budget, niveau académique, maturité dossier, blocage, horizon temporel, disposition à investir)

## 2. Store Zustand

- [x] 2.1 Créer `src/store/testStore.ts` : store Zustand avec état `{ answers, currentStep }`, actions `setAnswer`, `goToStep`, `nextStep`, `prevStep`, `reset`, `loadFromStorage`
- [x] 2.2 Synchronisation localStorage dans le store : écriture à chaque `setAnswer`, lecture dans `loadFromStorage` avec `try/catch` (fallback mémoire)

## 3. Composants

- [x] 3.1 Créer `src/components/features/test/ProgressBar.tsx` : barre de progression avec étape courante / total, affichage "X / 10"
- [x] 3.2 Créer `src/components/features/test/QuestionCard.tsx` : titre de la question + liste d'options radio-style (hauteur min 44px, zone tactile pleine largeur, état sélectionné visuellement distinct)
- [x] 3.3 Créer `src/components/features/test/TestStepper.tsx` (`'use client'`) : orchestrateur du questionnaire — charge le store, gère la navigation avant/arrière, détecte la session interrompue, redirige vers `/auth/register?from=test` à la complétion

## 4. Route et page

- [x] 4.1 Créer le groupe `src/app/(public)/` et déplacer ou créer `src/app/(public)/test/page.tsx` : Server Component qui importe `TestStepper`
- [x] 4.2 Vérifier que la route `/test` est bien exclue du matcher `proxy.ts` (routes publiques)

## 5. Validation

- [x] 5.1 Vérifier TypeScript : `npx tsc --noEmit` sans erreur sur les nouveaux fichiers
- [x] 5.2 Tester avec Playwright : chargement `/test`, sélection d'une réponse, navigation avant/arrière, persistance localStorage, redirection après la question 10
