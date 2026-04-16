## Why

Sans le questionnaire de profil, aucun parcours utilisateur ne peut aboutir : c'est la pièce centrale qui collecte les données nécessaires au scoring et aux recommandations. Il doit être anonyme, rapide (< 2 min), survivre aux interruptions mobiles (appels entrants, fermeture d'onglet) via localStorage, et conduire naturellement vers la création de compte.

## What Changes

- Création de la page `/test` (questionnaire 10 questions, anonyme, public)
- Composants de question réutilisables avec choix unique (radio-style mobile-first)
- Barre de progression visible à chaque étape
- Navigation avant/arrière entre questions
- Persistance des réponses dans `localStorage` (clé : `kraak_anonymous_session`)
- Redirection vers `/auth/register` à la complétion ("Crée ton compte pour voir tes résultats")
- Restauration automatique d'un test interrompu au rechargement de la page

## Capabilities

### New Capabilities

- `profile-test` : Questionnaire 10 questions avec état géré côté client (Zustand), persistance localStorage, barre de progression et navigation entre étapes

### Modified Capabilities

_(aucune — landing page existante non modifiée)_

## Impact

- `src/app/(public)/test/page.tsx` : nouvelle route publique (nécessite création du groupe `(public)`)
- `src/components/features/test/` : composants QuestionCard, ProgressBar, TestStepper
- `src/store/testStore.ts` : store Zustand pour l'état du questionnaire
- `src/types/test.ts` : types TypeScript pour questions et réponses
- Dépendances : Zustand déjà dans `package.json`, React Hook Form disponible (non requis pour ce composant simple)
- Aucune API ni base de données à ce stade (anonyme + localStorage)
