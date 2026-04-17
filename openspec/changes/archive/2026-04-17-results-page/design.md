## Context

La page `/results` est actuellement un Server Component qui monte `ResultsStub`, un Client Component affichant le segment et des placeholders. Les moteurs `computeScore` et `matchOpportunities` sont opérationnels. L'API Payload CMS expose `/api/opportunities` en REST. Il n'y a pas encore de données en base, le paiement n'est pas implémenté, et Prisma n'est pas configuré localement.

## Goals / Non-Goals

**Goals :**
- Afficher le profil complet : segment, sous-scores, score global
- Récupérer les opportunités depuis Payload CMS (avec fallback seed) et lancer le matching côté client
- Afficher les 2 premières recommandations librement (titre, pays, catégorie, deadline, justification)
- Afficher un paywall avec compteur d'opportunités verrouillées, proposition de valeur et CTA

**Non-Goals :**
- Intégration CinetPay (feature suivante)
- Persistance Prisma `UserProfileScore` / `Recommendation`
- Pagination des résultats
- Filtres ou tri manuel par l'utilisateur

## Decisions

### D1 — Architecture Server/Client hybride

`results/page.tsx` est un Server Component qui récupère les opportunités depuis Payload CMS (`fetch` interne), puis les passe en props à `ResultsClient.tsx` (Client Component). `ResultsClient` lit le score et les réponses depuis localStorage, importe `matchOpportunities` directement (pure function, pas d'appel API), et affiche les résultats.

Alternative écartée : tout côté client avec fetch côté client vers Payload → expose l'API interne inutilement et ralentit l'affichage initial.

### D2 — Fallback sur données de seed

Si l'appel Payload CMS échoue ou retourne zéro opportunités actives, le server component utilise `src/data/seed-opportunities.ts` (10 opportunités de démonstration en dur). Cela garantit un produit démontrable sans base de données configurée.

### D3 — Matching côté client via import direct

`ResultsClient` importe `matchOpportunities` depuis `@/domain/matching/matcher` directement — pas d'appel à `/api/matching`. La fonction est pure TypeScript, zéro dépendance serveur, bundle-safe. Avantage : pas de round-trip réseau, résultat instantané.

### D4 — Paywall à 2 recommandations libres

Les 2 premières `Recommendation[]` (par `match_score` décroissant) sont affichées complètement. Les suivantes sont verrouillées avec un overlay. Le CTA "Débloquer" navigue vers `/payment` (route placeholder — le vrai paiement est CinetPay feature suivante).

### D5 — Mapping study_level Payload → moteur de matching

Payload CMS utilise `bac3` (Licence) et `bac5` (Master), le moteur attend `licence` et `master`. Un mapper `normalizeStudyLevel()` est appliqué lors de la transformation des données Payload → type `Opportunity` du moteur.

### D6 — `ResultsStub` remplacé, pas déprécié côté export

`ResultsStub.tsx` est renommé en `ResultsClient.tsx` avec une logique entièrement réécrite. `results/page.tsx` importe `ResultsClient`. L'ancien fichier est supprimé.

## Risks / Trade-offs

- **[Risque] Payload CMS non démarré en local** → Mitigation : fallback seed immédiat, aucun crash
- **[Risque] Bundle client grossit avec le matcher** → Mitigation : `matchOpportunities` est ~2 KB minifié, acceptable
- **[Risque] localStorage absent (SSR / navigation incognito)** → Mitigation : guard try/catch existant, affiche "Refaire le test" si score absent

## Open Questions

- Quel prix afficher dans le paywall ? → `2 500 FCFA` comme valeur placeholder (modifiable avant lancement)
- Faut-il afficher le `short_description` dans la carte libre ou seulement dans la version débloquée ? → Afficher dans la version libre pour maximiser la valeur perçue et l'envie de payer pour la suite
