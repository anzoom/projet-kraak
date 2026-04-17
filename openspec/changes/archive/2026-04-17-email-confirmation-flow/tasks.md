## 1. Callback de confirmation email

- [x] 1.1 Modifier `/auth/callback/route.ts` : détecter `from=test` dans les searchParams et ajouter `?needs_scoring=true` dans la redirect vers `/results`
- [x] 1.2 Modifier `/auth/callback/route.ts` : remplacer la redirect d'erreur vers `/auth/login?error=confirmation_failed` par une redirect vers `/auth/confirm-error`

## 2. Page d'erreur de confirmation

- [x] 2.1 Créer `src/app/(app)/(public)/auth/confirm-error/page.tsx` avec message explicatif (lien expiré/invalide)
- [x] 2.2 Ajouter un champ email et bouton "Renvoyer le lien" appelant `supabase.auth.resend({ type: "signup", email })`
- [x] 2.3 Afficher un message de succès temporaire après renvoi

## 3. Formulaire d'inscription — emailRedirectTo

- [x] 3.1 Modifier `RegisterForm.tsx` : ajouter `options.emailRedirectTo` dans `supabase.auth.signUp()` quand `fromTest` est vrai, avec `?next=/results&from=test`
- [x] 3.2 Modifier l'état `confirmationPending` : ajouter la durée de validité du lien (24h) dans le message
- [x] 3.3 Ajouter un bouton "Renvoyer le lien" dans l'état `confirmationPending` appelant `supabase.auth.resend({ type: "signup", email })`

## 4. Page résultats — scoring post-confirmation

- [x] 4.1 Modifier `src/app/(app)/(public)/results/page.tsx` (ou son composant client) : détecter `?needs_scoring=true` au montage
- [x] 4.2 Si `needs_scoring=true` et réponses présentes dans localStorage : appeler `/api/scoring`, stocker le résultat sous `kraak_scoring_result`
- [x] 4.3 Nettoyer l'URL avec `router.replace("/results")` après le déclenchement du scoring
- [x] 4.4 Si `needs_scoring=true` mais localStorage vide : nettoyer le param et afficher un CTA "Refaire le test" sans erreur bloquante

## 5. Vérification du parcours complet

- [ ] 5.1 Tester le parcours : `/test` → inscription avec confirmation activée → email → callback → `/results` avec scoring
- [x] 5.2 Tester le cas d'erreur : lien expiré → redirection vers `/auth/confirm-error` → renvoi du lien
- [x] 5.3 Vérifier que le parcours sans confirmation (session immédiate) est toujours fonctionnel
