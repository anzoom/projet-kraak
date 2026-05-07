type ScoreMap = Record<string, number>

export const SCORING_RULES: {
  current_level: ScoreMap
  academic_level: ScoreMap
  budget: ScoreMap
  invest_readiness: ScoreMap
  dossier_maturity: ScoreMap
  timeline: ScoreMap
  main_blocker: ScoreMap
  budget_max_xof: ScoreMap
} = {
  current_level: {
    lycee: 20,
    licence_1_2: 40,
    licence_3: 60,
    master: 80,
    diplome: 70,
  },
  academic_level: {
    bac: 20,
    bac2: 40,
    licence: 60,
    master: 80,
    doctorat: 100,
  },
  budget: {
    zero: 20,
    petit: 40,
    moyen: 70,
    confortable: 100,
  },
  invest_readiness: {
    oui_certain: 100,
    peut_etre: 60,
    non_gratuit: 30,
    non_certain: 10,
  },
  dossier_maturity: {
    debut: 10,
    en_cours: 40,
    avance: 70,
    pret: 100,
  },
  timeline: {
    urgent: 90,
    court: 70,
    moyen: 50,
    long: 30,
  },
  main_blocker: {
    confiance: 70,
    documents: 60,
    eligibilite: 50,
    financement: 40,
    information: 30,
  },
  budget_max_xof: {
    zero: 0,
    petit: 500_000,
    moyen: 2_000_000,
    confortable: Number.MAX_SAFE_INTEGER,
  },
}
