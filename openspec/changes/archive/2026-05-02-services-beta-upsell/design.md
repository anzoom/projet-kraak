## Context

Depuis le pivot freemium → gratuit (21 avril 2026), la page `/results` affiche jusqu'à 5 recommandations gratuitement. Deux problèmes émergent lors de l'audit :

1. **Faille du quota** : `ResultsClient` recalcule les recommandations à chaque rendu. Un utilisateur pouvait modifier ses réponses, revenir sur `/results` et obtenir un nouveau set de 5 opportunités. Le quota était une illusion.

2. **Collecte d'intent absente** : les services Visa et Voyage ont été identifiés comme produits à forte valeur perçue (le refus de visa est la première cause d'abandon des candidatures). Aucun point de collecte ne permettait d'évaluer la demande réelle.

## Goals / Non-Goals

**Goals :**
- Verrouiller le quota de résultats par IDs d'opportunités (anti-contournement localStorage)
- Ajouter deux cartes de collecte d'email bêta dans `/results` (Visa + Voyage)
- Étendre la page `/coaching` à 4 offres organisées par section
- Ajouter les 4 services dans la landing `PremiumSection`
- Corriger le matcher pour les domaines indécis ("autre") et les opportunités mondiales ("international")

**Non-Goals :**
- Implémentation réelle des services Visa et Voyage (hors scope MVP)
- Paiement ou onboarding pour ces nouveaux services
- Modification du schéma Prisma ou des migrations DB

## Decisions

### D1 — Verrouillage par IDs dans localStorage (vs côté serveur)

**Choix : localStorage côté client** avec la clé `kraak_free_quota_ids`.

Rationale : le quota est un mécanisme UX, pas une barrière de sécurité critique (les opportunités sont publiques). Une solution serveur impliquerait une table Prisma, un endpoint et une complexité non justifiée pour le MVP. Le verrouillage client suffit pour décourager les contournements non intentionnels et afficher l'alerte appropriée.

Alternative écartée : endpoint `/api/user/quota` avec persistance DB — over-engineering pour le MVP.

### D2 — BetaServicesTeaser : formulaire email inline (vs lien vers /coaching)

**Choix : formulaire email inline** dans chaque carte.

Rationale : la friction minimale maximise les conversions. Rediriger vers `/coaching` pour exprimer de l'intérêt implique un changement de contexte coûteux. Le formulaire inline réutilise `POST /api/guide-premium/waitlist` avec un champ `source` discriminant (`beta_teaser_visa`, `beta_teaser_voyage`).

### D3 — BetaGuideTeaser : extraction en fichier autonome

**Choix : extraction en `BetaGuideTeaser.tsx`** séparé.

Rationale : le composant était défini inline dans `ResultsClient.tsx`, rendant le fichier difficile à maintenir. L'extraction améliore la lisibilité et prépare la réutilisabilité potentielle (ex. page `/guide-premium`).

### D4 — Domaine "autre" : désactivation du filtre (vs catégorie spéciale)

**Choix : `answers.domain = "autre"` désactive le filtre domaine** (traité comme `multidisciplinaire`).

Rationale : un utilisateur "indécis" ne doit pas se retrouver avec zéro résultat. Retourner toutes les opportunités sans filtre de domaine améliore l'expérience et augmente les chances de conversion.

### D5 — `opportunity.country = "international"` : toujours inclus

**Choix : les opportunités `country = "international"` passent toujours le filtre pays.**

Rationale : ces opportunités (ex. bourses mondiales UNESCO, programmes ONU) ont une portée géographique réelle sans restriction nationale. Les inclure systématiquement améliore la pertinence des résultats pour tous les profils.

## Risks / Trade-offs

- **[Risque] Quota contournable via DevTools** → Acceptable : les opportunités sont publiques, pas de données sensibles. L'alerte "quota épuisé" suffit pour le MVP.
- **[Risque] Double soumission sur le formulaire bêta** → Mitigation : `disabled={loading}` sur l'input et le bouton pendant l'appel API.
- **[Trade-off] Services Visa/Voyage visibles mais non opérationnels** → Assumé : les cartes sont explicitement labelisées "Bientôt" et collectent uniquement un email.

## Migration Plan

1. Ajouter logique quota dans `ResultsClient.tsx` (`kraak_free_quota_ids`)
2. Créer `BetaServicesTeaser.tsx` avec formulaires Visa et Voyage
3. Extraire `BetaGuideTeaser.tsx` de `ResultsClient.tsx`
4. Mettre à jour `matcher.ts` — domaine "autre" + country "international"
5. Ajouter option "autre" dans `src/data/questions.ts`
6. Étendre `coaching/page.tsx` à 4 offres en 2 sections
7. Mettre à jour `PremiumSection.tsx` avec grille 4 cartes
8. Mettre à jour `WaitlistForm.INTERESTS` avec visa et voyage
9. Mettre à jour les tests E2E (textes CTA, toggle dashboard)

Rollback : revert des fichiers frontend, aucune migration DB à défaire.
