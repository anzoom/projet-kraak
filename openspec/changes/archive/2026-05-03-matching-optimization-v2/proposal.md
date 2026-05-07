## Why

Le moteur de matching actuel présente trois problèmes qui nuisent directement à la crédibilité du produit :

1. **Bug silencieux scoring** (`scorer.ts:17`) : `invest_readiness` a été supprimée du questionnaire mais reste référencée dans le calcul du `financial_score`. Résultat : 30% du signal financier est perdu pour **tous les utilisateurs**. La segmentation Finaliste/Candidat/Explorer est faussée.

2. **Filtre budget non appliqué** : un utilisateur avec `budget=zero` peut recevoir des opportunités sans financement complet — des recommandations qu'il ne peut pas financer. Cela détruit la confiance dans le matching (60–70% des profils africains cibles ont `budget=zero`).

3. **Sorties utilisateur génériques** : les justifications ("catégorie correspond à ton objectif, domaine correspond à ta filière") sont identiques pour tous les profils. L'utilisateur ne perçoit pas que le matching est personnalisé. Résultat : faible conversion vers le coaching et le Guide Premium.

Ces trois problèmes combinés font que KRAAK ressemble à un filtre basique plutôt qu'à un "coach intelligent".

## What Changes

- **Corrigé** : bug `invest_readiness` dans `scorer.ts` — `financial_score` redevient un signal fiable
- **Corrigé** : filtre dur `budget=zero → funding_type must be complete` dans `matcher.ts`
- **Amélioré** : pondération `maturity_score` (dossier 55%, timeline 30%, blocage 15%) — dossier_maturity devient le signal dominant
- **Amélioré** : bonus financement complet +20 (au lieu de +15) — priorisation des opportunités 100% financées pour les profils africains
- **Nouveau** : bloc **Diagnostic KRAAK** avant les résultats — 3 à 4 lignes résumant le profil utilisateur (objectif, contrainte budget, point de vigilance, horizon)
- **Nouveau** : **justifications enrichies** par opportunité — spécifiques, basées sur un score de faisabilité (financier, académique, temporel)
- **Nouveau** : **plan d'action 3 étapes** généré depuis `main_blocker` + `dossier_maturity` + `timeline`, affiché après les résultats avec CTA vers coaching/guide
- **Amélioré** : wording des 10 questions (ton humain, micro-copy engageante, libellés d'options clarifiés)

## Capabilities

### Bugs corrigés

- `scoring-engine` : calcul `financial_score` corrigé (suppression référence `invest_readiness`)
- `matching-engine` : filtre dur budget=zero → uniquement opportunités 100% financées

### New Capabilities

- `kraak-diagnostic` : bloc profil synthétique généré depuis les réponses, affiché avant les recommandations
- `enriched-justification` : texte de pertinence spécifique par opportunité (faisabilité financière, académique, temporelle)
- `action-plan` : plan d'action 3 étapes personnalisé affiché après les 5 résultats

### Modified Capabilities

- `scoring-engine` : repondération globale (académique 35%, financier 25%, maturité 40%) et interne maturity_score
- `matching-engine` : bonus financement complet porté à +20, bonus domaine réduit à +20
- `questionnaire` : wording des questions et options de réponse optimisé (aucun changement structurel)
