## 1. Layout et structure des pages auth

- [x] 1.1 Créer `src/app/(public)/auth/layout.tsx` : layout minimal avec header KRAAK (même structure que `/test`)
- [x] 1.2 Créer le répertoire `src/app/(public)/auth/register/` et `src/app/(public)/auth/login/`

## 2. Page d'inscription

- [x] 2.1 Créer `src/components/features/auth/RegisterForm.tsx` (Client Component) : formulaire email/password, appel `signUp`, gestion d'erreurs inline, état loading
- [x] 2.2 Implémenter le flux post-inscription dans `RegisterForm.tsx` : lecture `kraak_anonymous_session`, appel `POST /api/scoring`, stockage `kraak_scoring_result`, redirection selon `?from=test`
- [x] 2.3 Créer `src/app/(public)/auth/register/page.tsx` : Server Component avec metadata, intègre `RegisterForm` et lien vers `/auth/login`

## 3. Page de connexion

- [x] 3.1 Créer `src/components/features/auth/LoginForm.tsx` (Client Component) : formulaire email/password, appel `signInWithPassword`, gestion d'erreurs inline, protection open redirect sur `?next`
- [x] 3.2 Créer `src/app/(public)/auth/login/page.tsx` : Server Component avec metadata, intègre `LoginForm` et lien vers `/auth/register`

## 4. Déconnexion

- [x] 4.1 Créer `src/app/auth/logout/route.ts` : Route Handler GET, appel `signOut` via `createSupabaseServerAnonClient`, redirection vers `/`

## 5. Page résultats stub

- [x] 5.1 Créer `src/components/features/results/ResultsStub.tsx` (Client Component) : lecture `kraak_scoring_result` depuis localStorage, affiche le segment ou invite à refaire le test
- [x] 5.2 Créer `src/app/(public)/results/page.tsx` : Server Component protégé, vérifie session via `createSupabaseServerAnonClient`, intègre `ResultsStub`
