export interface GuideModule {
  slug: string
  order: number
  icon: string
  title: string
  description: string
}

export const GUIDE_MODULES: GuideModule[] = [
  {
    slug: "introduction",
    order: 0,
    icon: "📖",
    title: "Pourquoi ce guide existe",
    description: "Les règles du jeu, les 3 erreurs fatales, et comment utiliser ce guide avec KRAAK.",
  },
  {
    slug: "mindset",
    order: 1,
    icon: "🧠",
    title: "Mindset & Fondations",
    description: "Développe l'état d'esprit et la posture du candidat qui réussit sur le long terme.",
  },
  {
    slug: "cartographie",
    order: 2,
    icon: "🗺️",
    title: "Cartographie des opportunités",
    description: "Comprends ce qui existe et apprends à naviguer le paysage des bourses intelligemment.",
  },
  {
    slug: "profil",
    order: 3,
    icon: "🧩",
    title: "Évaluer son profil et choisir ses cibles",
    description: "Fais une lecture lucide de ton profil et construis une stratégie en 3 niveaux.",
  },
  {
    slug: "dossier",
    order: 4,
    icon: "📂",
    title: "Construire son dossier de candidature",
    description: "Prépare chaque pièce de ton dossier pour convaincre avant l'entretien.",
  },
  {
    slug: "redaction",
    order: 5,
    icon: "✍️",
    title: "Rédiger une candidature qui se démarque",
    description: "Maîtrise la méthode STAR et les formulations qui font la différence.",
  },
  {
    slug: "entretien",
    order: 6,
    icon: "🎤",
    title: "Passer les entretiens de sélection",
    description: "Prépare les 10 questions fréquentes et maîtrise le pitch projet en 3 minutes.",
  },
  {
    slug: "admin",
    order: 7,
    icon: "📋",
    title: "Gérer les démarches administratives",
    description: "Visa, équivalence de diplômes, compte bancaire — anticipe pour ne pas perdre ta bourse.",
  },
  {
    slug: "depart",
    order: 8,
    icon: "✈️",
    title: "Préparer son départ et son arrivée",
    description: "Budget, logement, choc culturel — ce que personne ne t'explique vraiment avant de partir.",
  },
  {
    slug: "strategies",
    order: 9,
    icon: "🚀",
    title: "Stratégies avancées",
    description: "Cumul d'opportunités, réseau alumni, optimisation LinkedIn — pour aller plus loin que les autres.",
  },
]

export function getModuleBySlug(slug: string): GuideModule | undefined {
  return GUIDE_MODULES.find((m) => m.slug === slug)
}

export function getPrevNextModules(slug: string): {
  prev: GuideModule | null
  next: GuideModule | null
} {
  const idx = GUIDE_MODULES.findIndex((m) => m.slug === slug)
  return {
    prev: idx > 0 ? GUIDE_MODULES[idx - 1] : null,
    next: idx < GUIDE_MODULES.length - 1 ? GUIDE_MODULES[idx + 1] : null,
  }
}
