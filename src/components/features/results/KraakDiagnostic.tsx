import { questions } from "@/data/questions"
import { SPECIFIC_COUNTRIES, ZONE_LABELS } from "@/lib/countries"

interface DiagnosticLine {
  icon: string
  text: string
}

function getOptionLabel(questionId: string, value: string | undefined): string {
  if (!value) return ""
  const q = questions.find((q) => q.id === questionId)
  if (!q) return value
  const opt = q.options.find((o) => o.value === value)
  return opt?.label ?? value
}

function buildDiagnosticLines(answers: Record<string, string>): DiagnosticLine[] {
  const lines: DiagnosticLine[] = []

  const objectifLabel = getOptionLabel("main_objective", answers.main_objective)
  const tc = answers.target_country ?? ""
  const zoneLabel = SPECIFIC_COUNTRIES[tc]?.label ?? ZONE_LABELS[tc] ?? (tc === "peu_importe" ? "" : tc)
  if (objectifLabel) {
    lines.push({ icon: "🎯", text: `Objectif : ${objectifLabel}${zoneLabel ? ` — ${zoneLabel}` : ""}` })
  }

  if (answers.budget === "zero") {
    lines.push({ icon: "💰", text: "Contrainte : Budget zéro — financement complet uniquement" })
  } else if (answers.budget === "petit") {
    lines.push({ icon: "💰", text: "Budget : Limité — on filtre les opportunités accessibles" })
  }

  const vigilanceMap: Record<string, string> = {
    confiance: "Accompagnement recommandé pour avancer",
    documents: "Documents de candidature à préparer",
    eligibilite: "Critères d'éligibilité à vérifier attentivement",
    financement: "Concentre-toi sur les bourses à financement complet",
    information: "Explore activement les opportunités disponibles",
  }
  const vigilance = vigilanceMap[answers.main_blocker ?? ""]
  if (vigilance) {
    lines.push({ icon: "⚠️", text: `Vigilance : ${vigilance}` })
  }

  if (answers.timeline === "urgent") {
    lines.push({ icon: "⏱", text: "Horizon : Urgent — moins de 3 mois" })
  } else if (answers.timeline === "court") {
    lines.push({ icon: "⏱", text: "Horizon : 3 à 6 mois" })
  }

  return lines.slice(0, 4)
}

interface Props {
  answers: Record<string, string>
}

export default function KraakDiagnostic({ answers }: Props) {
  const lines = buildDiagnosticLines(answers)
  if (lines.length === 0) return null

  return (
    <div className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3.5">
      <p className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-2.5">
        Ton profil KRAAK
      </p>
      <ul className="space-y-1.5">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-dark leading-snug">
            <span className="shrink-0 text-base leading-tight">{line.icon}</span>
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
