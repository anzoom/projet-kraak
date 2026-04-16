## Context

La page actuelle (`src/app/page.tsx`) est un placeholder Next.js vide sans rapport avec KRAAK. La landing page doit être la première impression du produit pour des étudiants africains sur smartphone (réseau 3G/4G limité). Elle doit être statique (Server Component pur), charger en < 3 secondes, et pousser à un seul CTA : démarrer le test.

Architecture existante : Next.js 16 App Router, Tailwind CSS v4, shadcn/ui (style new-york), lucide-react, TypeScript strict. Aucun composant UI shadcn n'est installé dans `/components/ui/` pour le moment.

## Goals / Non-Goals

**Goals:**
- Page statique Server Component (zéro JS client non nécessaire)
- Mobile-first, performante sur réseaux limités (pas d'images lourdes, pas de bibliothèques JS supplémentaires)
- Copywriting en français orienté action et confiance pour la cible africaine francophone
- CTA "Tester mon profil" visible sans scroll sur mobile (above the fold)
- Sections : Navbar, Hero, Comment ça marche, Bénéfices, Réassurance, CTA final, Footer
- Palette de couleurs KRAAK définie dans globals.css via variables CSS
- Aucun mode sombre (supprimé des styles globaux pour le MVP)

**Non-Goals:**
- Animations complexes ou bibliothèques d'animation (Framer Motion, etc.)
- Images/photos réelles (remplacées par des illustrations SVG inline ou icônes lucide)
- Internationalisation (français uniquement pour le MVP)
- A/B testing (Phase 2)
- Page d'erreur ou loading state (page statique)

## Decisions

### D1 — Server Component pur, pas de `'use client'`

La landing page ne nécessite aucune interactivité côté client. Server Component par défaut = HTML pré-rendu envoyé au navigateur, zéro JS supplémentaire. Le CTA est un simple lien `<a href="/test">`.

Alternative rejetée : composant client avec état → pénalise les réseaux africains sans valeur ajoutée.

### D2 — Tailwind CSS v4 utility classes uniquement, pas de shadcn/ui

Pour une page statique, installer des composants shadcn/ui (Button, Card...) pour une landing page serait over-engineered. Tailwind seul suffit et évite l'overhead de Radix UI.

Alternative rejetée : shadcn Button → imports Radix qui ajoutent du JS inutile pour une landing page.

### D3 — Composants de section dans `src/components/features/landing/`

Chaque section (Navbar, Hero, HowItWorks, Benefits, Reassurance, CtaSection, Footer) est un composant Server Component séparé dans `src/components/features/landing/`. La `page.tsx` orchestre les sections.

Bénéfice : facilite les A/B tests futurs (Phase 2) et les mises à jour copywriting sans toucher à la page racine.

### D4 — Palette KRAAK dans globals.css via variables CSS

Couleurs définies comme custom properties CSS (`--color-primary`, `--color-primary-dark`, etc.) dans `globals.css` et référencées dans les classes Tailwind via `bg-[var(--color-primary)]`. Pas de fichier `tailwind.config.ts` à modifier (Tailwind v4 gère les tokens différemment).

Primary : `#F97316` (orange-500 Tailwind) — énergie, action
Dark text : `#0F172A` (slate-900) — lisibilité, confiance
Background : `#FFFFFF`
Accent light : `#FFF7ED` (orange-50) — sections alternées

### D5 — Suppression du dark mode dans globals.css

Le CLAUDE.md et le PRD interdisent explicitement le dark mode pour le MVP. La `@media (prefers-color-scheme: dark)` est retirée de globals.css.

## Risks / Trade-offs

- **[Risque] Copywriting générique** → Mitigation : textes spécifiques à la cible (Africa francophone, exemples concrets : "bourse Canada", "formation en ligne", "programme d'échange")
- **[Risque] CTA pas visible sans scroll sur petit écran (< 375px)** → Mitigation : hero minimaliste avec padding réduit sur mobile, CTA en hauteur fixe 52px avec texte court
- **[Risque] Polices Google Fonts lentes sur réseaux africains** → Mitigation : Geist est une police variable déjà chargée dans layout.tsx (next/font, optimisée)

## Open Questions

- L'URL du test est-elle `/test` ? (Conforme à l'architecture ARCHITECTURE.md — oui)
- Le logo KRAAK final existe-t-il ? (Non pour le MVP → utiliser le nom textuel stylisé "KRAAK")
- Faut-il un compteur de stats (ex: "2 000 étudiants aidés") ? (À valider — placeholder pour le MVP)
