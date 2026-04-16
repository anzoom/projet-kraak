## 1. Styles globaux et layout

- [x] 1.1 Mettre à jour `src/app/globals.css` : supprimer le block `@media (prefers-color-scheme: dark)`, définir la palette KRAAK (primary orange, dark text, background blanc, accent light)
- [x] 1.2 Mettre à jour `src/app/layout.tsx` : métadonnées (titre "KRAAK", description), langue `fr`, supprimer les classes dark mode

## 2. Composants de section landing

- [x] 2.1 Créer `src/components/features/landing/Navbar.tsx` : logo KRAAK textuel + bouton CTA "Démarrer le test" → `/test`
- [x] 2.2 Créer `src/components/features/landing/HeroSection.tsx` : promesse principale (< 2 lignes), sous-titre, bouton CTA principal "Tester mon profil" → `/test` (visible above the fold sur mobile)
- [x] 2.3 Créer `src/components/features/landing/HowItWorks.tsx` : 3 étapes numérotées avec icône, titre, description courte
- [x] 2.4 Créer `src/components/features/landing/BenefitsSection.tsx` : 4 bénéfices avec icône lucide, titre, description courte
- [x] 2.5 Créer `src/components/features/landing/ReassuranceSection.tsx` : 3 éléments de réassurance (sources vérifiées, personnalisation, rapidité)
- [x] 2.6 Créer `src/components/features/landing/CtaSection.tsx` : section finale avec promesse répétée + bouton CTA "Tester mon profil"
- [x] 2.7 Créer `src/components/features/landing/Footer.tsx` : footer minimal (© KRAAK, liens légaux placeholder)

## 3. Page principale

- [x] 3.1 Réécrire `src/app/page.tsx` en Server Component pur : importer et orchestrer toutes les sections dans l'ordre (Navbar, Hero, HowItWorks, Benefits, Reassurance, Cta, Footer)

## 4. Validation

- [x] 4.1 Vérifier que `next build` passe sans erreur TypeScript ni ESLint
- [x] 4.2 Tester la page avec Playwright : CTA visible sans scroll sur mobile (375px), pas de défilement horizontal, zones tactiles ≥ 44px, redirection `/test` au clic CTA
