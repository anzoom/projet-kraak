import Link from "next/link"
import type { Segment } from "@/types/scoring"

function buildActionPlan(answers: Record<string, string>, segment: Segment): string[] {
  const steps: string[] = []

  const step1Map: Record<string, string> = {
    information: "Explore les 5 opportunités ci-dessus et note celles qui t'intéressent",
    eligibilite: "Lis attentivement les critères d'éligibilité de chaque opportunité",
    documents: "Prépare maintenant : relevés de notes, CV et une lettre de motivation type",
    financement: "Concentre-toi sur les opportunités marquées 'financement complet'",
    confiance: "Choisis 1 opportunité qui te parle et lis les témoignages de lauréats",
  }
  steps.push(
    step1Map[answers.main_blocker ?? ""] ??
    "Explore les 5 opportunités et identifie celle qui correspond le mieux à ton projet"
  )

  const step2Map: Record<string, string> = {
    debut: "Commence par rassembler tes relevés de notes et ton CV en 1 semaine",
    en_cours: "Finalise ton dossier en ciblant la deadline la plus proche",
    avance: "Peaufine ta lettre de motivation et vérifie chaque critère d'éligibilité",
    pret: "Tu es prêt à candidater — envoie ta candidature avant la deadline",
  }
  steps.push(
    step2Map[answers.dossier_maturity ?? ""] ??
    "Avance sur ton dossier pas à pas, une étape à la fois"
  )

  if (answers.timeline === "urgent") {
    steps.push("Il te reste peu de temps — priorise les opportunités avec deadline dans les 90 jours")
  } else if (segment === "Explorer") {
    steps.push("Améliore ton dossier pendant 2 mois, puis reviens tester ton profil mis à jour")
  } else {
    steps.push("Sauvegarde tes opportunités et active les alertes deadline pour ne rien rater")
  }

  return steps
}

interface Props {
  answers: Record<string, string>
  segment: Segment
}

export default function ActionPlan({ answers, segment }: Props) {
  const steps = buildActionPlan(answers, segment)

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
      <p className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-3">
        📋 Ton plan d'action
      </p>
      <ol className="space-y-2.5 mb-4">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-slate-dark leading-snug">{step}</span>
          </li>
        ))}
      </ol>
      <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
        <Link
          href="/coaching"
          className="flex-1 flex items-center justify-center h-9 rounded-full bg-primary text-white font-semibold text-xs hover:bg-primary-dark transition-colors"
        >
          Être accompagné →
        </Link>
        <Link
          href="/guide-premium"
          className="flex-1 flex items-center justify-center h-9 rounded-full border-2 border-primary text-primary font-semibold text-xs hover:bg-primary/5 transition-colors"
        >
          Accéder au Guide →
        </Link>
      </div>
    </div>
  )
}
