## Tasks

- [x] Ajouter lien "Mot de passe oublié ?" dans `LoginForm` (sous le champ mot de passe)
- [x] Ajouter lecture `fromTest` via `useSearchParams` dans `LoginForm`
- [x] Adapter sous-titre `LoginForm` selon contexte `from=test`
- [x] Adapter lien "Créer un compte" pour inclure `?from=test` si contexte actif
- [x] Créer `ForgotPasswordForm` : champ email, appel `resetPasswordForEmail`, écran confirmation
- [x] Créer page `/auth/forgot-password`
- [x] Créer `UpdatePasswordForm` : deux champs mot de passe, validation client, `updateUser`
- [x] Créer page `/auth/update-password`
- [x] Modifier `TestStepper` : redirection vers `/auth/login?from=test` au lieu de `/auth/register?from=test`
- [x] Vérifier que `/auth/callback` gère le redirect vers `/auth/update-password` sans modification
- [x] Tester les pages forgot-password et update-password via Playwright
