"use client"

import { useEffect, useState } from "react"
import { X, ExternalLink, CheckCircle2, CalendarDays, Share2 } from "lucide-react"
import type { Opportunity } from "@/types/scoring"

const CATEGORY_LABELS: Record<string, string> = {
  bourse: "Bourse",
  formation: "Formation",
  echange: "Programme d'échange",
  stage: "Stage",
  emploi: "Emploi",
}

const FUNDING_LABELS: Record<string, string> = {
  complete: "Financement complet",
  partial: "Financement partiel",
  non_financee: "Sans financement",
  salariee: "Poste salarié",
}

function buildApplicationSteps(opp: Opportunity): string[] {
  const { category: cat, country, funding_type, deadline, eligibility_summary } = opp
  const steps: string[] = []

  // Étape 1 — éligibilité (personnalisée depuis eligibility_summary)
  const eligLine = eligibility_summary?.split(".")[0]?.trim()
  steps.push(
    eligLine
      ? `Vérifie ton éligibilité : ${eligLine}.`
      : "Vérifie ton éligibilité (niveau d'études, nationalité, âge requis)."
  )

  // Étape 2 — constitution du dossier (selon catégorie + financement)
  if (cat === "bourse") {
    steps.push(
      "Rassemble ton dossier complet : CV, relevés de notes, lettres de recommandation et lettre de motivation."
    )
  } else if (cat === "formation") {
    steps.push(
      funding_type === "complete"
        ? "Prépare ton dossier de candidature : CV, relevés de notes, lettre de motivation (financement couvert — aucun justificatif de ressources requis)."
        : "Prépare ton dossier de candidature : CV, relevés de notes, justificatifs de ressources et lettre de motivation."
    )
  } else if (cat === "echange") {
    steps.push(
      "Obtiens la validation de ton responsable pédagogique et prépare le dossier d'échange : contrat d'études, CV, lettre de motivation."
    )
  } else if (cat === "stage") {
    steps.push("Prépare ton CV et ta lettre de motivation ciblée sur les missions du poste.")
  } else {
    steps.push("Prépare ton CV et ta lettre de motivation adaptée au profil et au secteur recherché.")
  }

  // Étape 3 — plateforme de candidature (selon pays + catégorie)
  if (country === "france" && (cat === "bourse" || cat === "formation")) {
    steps.push("Crée ou mets à jour ton dossier sur Campus France (campusfrance.org) et soumets ta candidature.")
  } else if (country === "canada") {
    steps.push("Soumets ta candidature en ligne sur le portail officiel de l'établissement ou de l'organisme.")
  } else if (country === "usa") {
    steps.push("Soumets ta candidature via le portail dédié de l'établissement (Common App ou portail propre).")
  } else if (country === "europe") {
    steps.push(
      cat === "echange"
        ? "Dépose ton dossier via le bureau des relations internationales de ton université (portail Erasmus+)."
        : "Soumets ta candidature directement sur le portail officiel de l'établissement européen cible."
    )
  } else {
    steps.push("Postule directement sur le site officiel de l'organisme en suivant les instructions de candidature.")
  }

  // Étape 4 — suivi et sélection (selon catégorie + deadline)
  if (cat === "emploi" || cat === "stage") {
    steps.push(
      cat === "stage"
        ? "Passe l'entretien de sélection et fais valider ta convention de stage par ton établissement."
        : "Passe les entretiens de sélection (RH puis technique) et assure le suivi de ta candidature."
    )
  } else if (cat === "bourse" && deadline) {
    const d = new Date(deadline)
    const formatted = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    steps.push(`Soumets ton dossier complet avant le ${formatted} et confirme la bonne réception par email.`)
  } else {
    steps.push("Suis l'avancement de ta candidature et réponds rapidement aux demandes de compléments de dossier.")
  }

  // Étape 5 — démarches pratiques (visa, logement — selon pays)
  if (country === "france") {
    steps.push("Prépare ton visa étudiant ou de travail et effectue les démarches de logement en France (CROUS, Studapart…).")
  } else if (country === "canada") {
    steps.push("Fais ta demande de permis d'études ou de travail sur le portail IRCC Canada et prépare ton installation.")
  } else if (country === "usa") {
    steps.push("Prépare ton visa F-1, J-1 ou H-1B selon ta situation et effectue les formalités consulaires.")
  } else if (country === "europe") {
    steps.push("Prépare ton visa Schengen ou titre de séjour selon le pays d'accueil et organise ton hébergement.")
  } else {
    steps.push("Prépare les documents administratifs nécessaires (visa si requis) et planifie ton installation sur place.")
  }

  return steps
}

function formatDeadline(deadline: string): string {
  const d = new Date(deadline)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

function formatBudget(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

interface Props {
  opportunity: Opportunity
  onClose: () => void
}

export default function OpportunityDetailModal({ opportunity, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = `${window.location.origin}/?opp=${opportunity.id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: opportunity.title, url: shareUrl })
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        // clipboard unavailable
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [onClose])

  const steps = buildApplicationSteps(opportunity)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90dvh] flex flex-col shadow-2xl">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary-light text-primary text-xs font-semibold">
                {CATEGORY_LABELS[opportunity.category] ?? opportunity.category}
              </span>
              <span className="text-xs text-slate-mid capitalize">{opportunity.country}</span>
            </div>
            <h2 className="text-base font-black text-slate-dark leading-snug">
              {opportunity.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-slate-mid transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-gray-100 text-slate-mid text-xs font-medium">
              {FUNDING_LABELS[opportunity.funding_type] ?? opportunity.funding_type}
            </span>
            {opportunity.deadline && (
              <span className="inline-flex items-center h-6 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                Deadline : {formatDeadline(opportunity.deadline)}
              </span>
            )}
            {opportunity.budget_required !== null && opportunity.budget_required > 0 && (
              <span className="inline-flex items-center h-6 px-3 rounded-full bg-gray-100 text-slate-mid text-xs font-medium">
                Budget requis : {formatBudget(opportunity.budget_required)}
              </span>
            )}
          </div>

          {/* Description */}
          {opportunity.short_description && (
            <div>
              <h3 className="text-sm font-bold text-slate-dark mb-1.5">Présentation</h3>
              <p className="text-sm text-slate-mid leading-relaxed">
                {opportunity.short_description}
              </p>
            </div>
          )}

          {/* Eligibility */}
          {opportunity.eligibility_summary && (
            <div>
              <h3 className="text-sm font-bold text-slate-dark mb-1.5">Conditions d'éligibilité</h3>
              <p className="text-sm text-slate-mid leading-relaxed">
                {opportunity.eligibility_summary}
              </p>
            </div>
          )}

          {/* Steps */}
          <div>
            <h3 className="text-sm font-bold text-slate-dark mb-2">Démarche de candidature</h3>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-mid leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-3">
          {opportunity.source_url && (
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark shadow-md shadow-orange-100 transition-colors"
            >
              Postuler sur le site officiel
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <div className="flex gap-2">
            <a
              href="/coaching"
              className="flex items-center justify-center gap-2 flex-1 h-12 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary-light transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              Me faire accompagner
            </a>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 flex-1 h-12 rounded-full border-2 border-gray-200 text-slate-mid font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "✓ Lien copié !" : "Partager"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
