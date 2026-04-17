## Why

La page `/results` affiche actuellement un stub (segment + placeholder "recommandations arrivent bientôt") : la proposition de valeur centrale de KRAAK — des opportunités personnalisées — n'est pas encore délivrée. Sans résultats réels, il n'y a pas de paywall fonctionnel et donc pas de chemin vers le revenu.

## What Changes

- Remplacement de `ResultsStub` par une page complète : segment, sous-scores, liste de recommandations avec justification
- Les 2 premières recommandations sont affichées librement (aperçu gratuit)
- Les recommandations suivantes sont verrouillées derrière un paywall avec compteur et CTA (UI only — paiement CinetPay dans la feature suivante)
- Création de `src/data/seed-opportunities.ts` : 10 opportunités de démonstration pour tester le matching en local (utilisées si Payload CMS ne répond pas ou est vide)
- Fetch des opportunités depuis l'API Payload CMS côté serveur, avec fallback sur les données de seed
- Mapping des valeurs `study_level` Payload CMS → valeurs attendues par le moteur de matching

## Capabilities

### New Capabilities

- `results-display` : Affichage complet du profil scoré (segment, sous-scores, score global) et des recommandations libres (2 premières) avec justification et métadonnées de chaque opportunité
- `results-paywall` : Section de verrouillage affichant le nombre d'opportunités restantes, la valeur débloquée, le prix et un CTA vers le paiement (placeholder pour CinetPay)

### Modified Capabilities

- `auth-session` : La requirement "Page résultats stub" évolue en "Page résultats complète" — la page doit désormais afficher un contenu réel, pas un placeholder

## Impact

- `src/components/features/results/ResultsStub.tsx` → remplacé par `ResultsClient.tsx` (Client Component)
- `src/app/(public)/results/page.tsx` → enrichi avec fetch Payload CMS côté serveur
- `src/data/seed-opportunities.ts` — nouveau fichier de données de démonstration
- `src/types/scoring.ts` — ajout de `studyLevel` mapping si nécessaire
- Dépendance : Payload CMS REST API (`/api/opportunities`) via `fetch` interne
- Pas de Prisma, pas de CinetPay (features suivantes)
