## 1. Quota de résultats — verrouillage anti-contournement

- [x] 1.1 Ajouter `STORAGE_KEY_QUOTA = "kraak_free_quota_ids"` dans `ResultsClient.tsx`
- [x] 1.2 Implémenter la logique de fixation du quota à la première consultation (IDs sauvegardés au premier accès)
- [x] 1.3 Implémenter la détection de contournement (comparaison des nouveaux IDs vs IDs du quota)
- [x] 1.4 Afficher l'alerte amber `quotaExhausted` avec CTA vers `/guide-premium`
- [x] 1.5 Reconstruire les recommandations à partir des IDs du quota (retrouver les opportunités disparues du nouveau matching)

## 2. Composants teasers bêta

- [x] 2.1 Créer `src/components/features/results/BetaServicesTeaser.tsx` avec cartes Visa et Voyage
- [x] 2.2 Implémenter le formulaire email inline avec `POST /api/guide-premium/waitlist` et champ `source`
- [x] 2.3 Ajouter la gestion de l'état `loading` et `submitted` par carte
- [x] 2.4 Désactiver le champ email et le bouton pendant `loading = true` (anti double-soumission)
- [x] 2.5 Capturer l'événement PostHog `beta_service_interest` avec la propriété `source`
- [x] 2.6 Extraire `BetaGuideTeaser.tsx` de `ResultsClient.tsx` en fichier autonome
- [x] 2.7 Mettre à jour l'ordre d'affichage dans `ResultsClient.tsx` : quota alert → BetaServicesTeaser → BetaGuideTeaser → coconstruction

## 3. Moteur de matching

- [x] 3.1 Ajouter la condition `answers.domain !== "autre"` dans le hard filter domaine (désactivation du filtre)
- [x] 3.2 Ajouter la condition `normalize(oppCountry) === "international"` dans `isCountryCompatible` (toujours inclus)

## 4. Formulaire de test

- [x] 4.1 Ajouter `{ value: "autre", label: "Autre domaine — je n'ai pas encore décidé" }` dans la question domaine de `src/data/questions.ts`
- [x] 4.2 Supprimer l'option `international` du dropdown pays de destination (`CountrySelectCard` + `/api/countries`)

## 5. Page coaching

- [x] 5.1 Réorganiser `coaching/page.tsx` en deux sections : "Conseil individuel" et "Services pratiques"
- [x] 5.2 Créer l'offre "Aide démarches visa" avec 4 prestations (checklist, modèles lettre, anti-refus, calendrier)
- [x] 5.3 Créer l'offre "Voyage & Hébergement" avec 4 prestations (billets, logement, installation, budget)
- [x] 5.4 Ajouter les ancres `#visa` et `#voyage` pour les liens entrants

## 6. Landing page

- [x] 6.1 Mettre à jour `PremiumSection.tsx` — grille 2×2 avec 4 cartes (Guide, Coaching, Visa, Voyage)
- [x] 6.2 Appliquer les thèmes alternés : Guide + Visa = thème Guide ; Coaching + Voyage = thème Coaching
- [x] 6.3 Mettre à jour le texte CTA hero : "Tester mon profil" → "Voir mes résultats en < 1 min"

## 7. Formulaire waitlist

- [x] 7.1 Ajouter les intérêts `{ value: "visa", label: "Aide démarches visa" }` et `{ value: "voyage", label: "Voyage & Hébergement" }` dans `WaitlistForm.INTERESTS`

## 8. Tests E2E

- [x] 8.1 Mettre à jour `tests/e2e/landing.spec.ts` — CTA regex `/voir mes résultats/i` + `.first()` pour éviter les violations strict mode
- [x] 8.2 Mettre à jour `tests/e2e/freemium-auth-gate.spec.ts` — texte paywall "🔒 Bientôt disponible"
- [x] 8.3 Réécrire `tests/e2e/opportunity-alerts.spec.ts:59` (test 7.4) — vérifier que le toggle est désactivé sans accès Guide Premium (MVP)
