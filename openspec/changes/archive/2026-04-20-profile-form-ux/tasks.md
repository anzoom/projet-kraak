## 1. Formulaire — question pays d'origine

- [x] 1.1 Ajouter la question `origin_country` en première position dans `src/data/questions.ts` avec les 9 pays CinetPay + "Autre pays africain"
- [x] 1.2 Supprimer la question `invest_readiness` de `src/data/questions.ts`
- [x] 1.3 Vérifier que `TOTAL = questions.length` reflète bien 10 questions dans `TestStepper.tsx`

## 2. Formulaire — conversion en dropdowns

- [x] 2.1 Convertir la question `domain` en `SelectCard` (menu déroulant) dans `src/data/questions.ts`
- [x] 2.2 Convertir les questions `budget`, `academic_level`, `dossier_maturity`, `main_blocker`, `timeline` en `SelectCard`
- [x] 2.3 Simplifier le rendu dans `TestStepper.tsx` : `CountrySelectCard` pour `target_country`, `SelectCard` pour toutes les autres questions
- [x] 2.4 Supprimer les imports inutilisés (`QuestionCard`, anciens composants radio) dans `TestStepper.tsx`

## 3. Formulaire — redirection conditionnelle post-test

- [x] 3.1 Modifier `handleNext()` dans `TestStepper.tsx` : appeler `createSupabaseBrowserClient().auth.getSession()` à la dernière question
- [x] 3.2 Router vers `/results` si session active, vers `/auth/register?from=test` sinon
- [x] 3.3 Corriger l'import : `createSupabaseBrowserClient` (était `createClient`)

## 4. Moteur de matching — origin_country

- [x] 4.1 Ajouter la constante `AFRICAN_COUNTRIES` (Set de 9 pays) dans `src/domain/matching/matcher.ts`
- [x] 4.2 Implémenter le filtre dur pour `target_country = "afrique"` : inclure si `country ∈ AFRICAN_COUNTRIES` OU `country = "afrique"`, exclure si `country = origin_country`
- [x] 4.3 Implémenter le scoring `+20` pour `target_country = "afrique"` : bonus si `country ∈ AFRICAN_COUNTRIES` ET `country ≠ origin_country` (ou `country = "afrique"`)
- [x] 4.4 Corriger les bugs de scoring détectés : filtre domain (comparaison `.includes`), filtre country (branche `else if` manquante)
- [x] 4.5 Mettre à jour `src/domain/matching/matcher.test.ts` : 8 tests ajustés pour utiliser des combinaisons valides passant les filtres durs

## 5. Modale de détail — bouton coaching

- [x] 5.1 Ajouter l'import `CalendarDays` depuis `lucide-react` dans `OpportunityDetailModal.tsx`
- [x] 5.2 Rendre le footer de la modale toujours visible (supprimer la condition sur `source_url` pour le footer)
- [x] 5.3 Ajouter le bouton "Réserver un coaching / suivi" liant vers `/coaching` (style outline, toujours affiché)
- [x] 5.4 Conserver le bouton "Postuler sur le site officiel" conditionnel à `source_url`

## 6. Landing page — auth-aware

- [x] 6.1 Convertir `Navbar.tsx` en Server Component `async` : ajouter `createSupabaseServerAnonClient()` et `getSession()`
- [x] 6.2 Afficher "Mes résultats" (→ `/results`) si session, sinon "Se connecter" (texte) + "S'inscrire" (bouton orange → `/auth/register`)
- [x] 6.3 Convertir `HeroSection.tsx` en Server Component `async` : même logique de session
- [x] 6.4 Afficher "Voir mes résultats" + "Refaire le test" si session connecté
- [x] 6.5 Afficher "Tester mon profil" + "Déjà un compte ? Se connecter" + compteur social si non connecté

## 7. Tests et validation

- [x] 7.1 Lancer `npx vitest run` — tous les tests passent (28 tests, 0 échec)
- [x] 7.2 Vérifier l'affichage mobile du formulaire en dropdowns
- [x] 7.3 Vérifier la redirection post-test selon session (connecté → `/results`, non-connecté → `/auth/register?from=test`)
- [x] 7.4 Vérifier la landing page : CTAs corrects pour connecté et non-connecté
- [x] 7.5 Vérifier la modale : bouton coaching toujours visible, Postuler conditionnel
