## Architecture des corrections

### Cache invalidation (ResultsClient)

**Problème** : le cache `kraak_scoring_result` était lu avant les réponses de session. Si le cache existait, les nouvelles réponses étaient ignorées.

**Solution** : lecture des réponses de session en premier (`kraak_anonymous_session`), puis comparaison clé/valeur avec le cache. Le cache n'est utilisé que si les réponses sont identiques. Sinon, l'API `/api/scoring` est appelée et le cache est mis à jour.

```
Session answers → Compare avec cache → Identique ? Utilise cache : Re-score
```

Fonction `answersMatch(a, b)` : comparaison exacte clé/valeur en O(n), sans dépendance à l'ordre des clés JSON.

### Reset formulaire (TestStepper)

**Problème** : le store Zustand persiste via localStorage, donc les réponses survivaient aux déconnexions.

**Solution** : `useEffect` au montage de `TestStepper` appelle `reset()` (remet `answers = {}` et `currentStep = 0`) et supprime `kraak_scoring_result`. Chaque visite sur `/test` est une session vierge.

### Filtres durs dans matchOpportunities

**Avant** : catégorie (+30), domaine (+25), pays (+20/-25) étaient des bonus/pénalités. Une opportunité hors-cible avec d'autres bons critères pouvait dépasser une opportunité pertinente.

**Après** : ordre de filtrage avant scoring :
1. `is_active = false` → exclu
2. `study_level` incompatible → exclu
3. `deadline` dépassée → exclu
4. `category ≠ main_objective` → exclu
5. `domain ≠ answers.domain` → exclu
6. `country ≠ target_country` (sauf `peu_importe`) → exclu

Le scoring ne sert qu'au **classement** des opportunités ayant passé tous les filtres : financement complet, deadline proche, budget.

### Alignement valeur domaine

`questions.ts` utilisait `arts_com` ; les seeds et la collection Payload utilisent `lettres_arts`. La valeur de la question est alignée sur `lettres_arts` — source unique de vérité pour les valeurs de domaine.
