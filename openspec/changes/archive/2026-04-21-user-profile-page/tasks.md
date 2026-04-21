## 1. Créer le composant ProfileClient

- [x] 1.1 Créer `src/components/features/profile/ProfileClient.tsx` (client component) :
  - Props : `email: string`
  - Lire `localStorage.getItem("kraak_anonymous_session")` après montage (guard `isMounted`)
  - Parser les réponses : `session.state?.answers ?? session.answers ?? {}`
  - Importer `questions` depuis `@/data/questions.ts` pour mapper valeurs → labels
  - Afficher l'email dans une section "Mon compte"
  - Afficher les réponses sous forme de liste "Question → Réponse" dans une section "Mon profil de test" (message si absent)
  - Bouton "Se déconnecter" : appelle `createSupabaseBrowserClient().auth.signOut()` puis `router.push("/")`

## 2. Créer la page /dashboard

- [x] 2.1 Créer `src/app/(app)/(protected)/dashboard/page.tsx` :
  - Server Component, récupère l'utilisateur via `createSupabaseServerAnonClient().auth.getUser()`
  - Si pas d'utilisateur (edge case), redirect vers `/auth/login`
  - Passe `email={user.email ?? ""}` à `<ProfileClient />`
  - Header avec logo "KRAAK" + lien "← Mes résultats"
  - Métadonnées : `title: "Mon profil — KRAAK"`

## 3. Ajouter les actions rapides dans ProfileClient

- [x] 3.1 Section "Actions" avec 3 liens :
  - "Voir mes résultats →" → `href="/results"` (bouton primaire)
  - "Refaire le test" → `href="/test"` (bouton secondaire border)
  - "Changer mon mot de passe" → `href="/auth/update-password"` (lien texte)

## 4. Modifier la Navbar

- [x] 4.1 Dans `src/components/features/landing/Navbar.tsx`, quand `session` est actif, remplacer le CTA unique par deux éléments :
  - Lien texte "Mon profil" → `href="/dashboard"` (style `text-sm font-medium text-slate-mid hover:text-slate-dark`)
  - Bouton "Mes résultats" → `href="/results"` (style primaire inchangé)

## 5. Vérification

- [x] 5.1 Lancer `npx tsc --noEmit` — zéro erreur TypeScript
- [x] 5.2 Lancer `npx vitest run` — zéro régression
- [x] 5.3 Test manuel : naviguer vers `/dashboard` connecté — vérifier email, réponses et boutons
- [x] 5.4 Test manuel : bouton "Se déconnecter" — vérifier redirection vers `/` et session effacée
- [x] 5.5 Test manuel : Navbar landing — vérifier que "Mon profil" est visible quand connecté
