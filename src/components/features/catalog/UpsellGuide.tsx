import Link from "next/link"
import type { Opportunity } from "@/types/scoring"

const BENEFITS = [
  { icon: "📚", text: "Guide interactif : fiches détaillées pour chaque opportunité" },
  { icon: "🔔", text: "Alertes personnalisées : nouvelles opportunités selon ton profil" },
  { icon: "📬", text: "Newsletter mensuelle : sélection des meilleures bourses et programmes" },
  { icon: "🗂️", text: "Catalogue complet : toutes les catégories, tous les pays" },
]

const CATEGORY_LABELS: Record<string, string> = {
  bourse: "Bourse",
  programme: "Programme",
  fellowship: "Fellowship",
  concours: "Concours",
  prix: "Prix",
  autre: "Autre",
}

const ZONE_LABELS: Record<string, string> = {
  afrique: "Afrique",
  europe: "Europe",
  amerique_nord: "Amérique du Nord",
  asie: "Asie",
  amerique_sud: "Amérique du Sud",
  moyen_orient: "Moyen-Orient",
  oceanie: "Océanie",
  international: "International / Mondial",
}

interface Props {
  previewOpportunities: Opportunity[]
  totalCount: number
}

export default function UpsellGuide({ previewOpportunities, totalCount }: Props) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <p className="text-3xl mb-2">📚</p>
        <h1 className="text-xl font-black text-slate-dark mb-1">Catalogue complet</h1>
        <p className="text-sm font-semibold text-primary">KRAAK Premium Guide</p>
      </div>

      {/* Aperçu flouté */}
      <div className="relative">
        <div className="space-y-3 pointer-events-none select-none" aria-hidden="true">
          {previewOpportunities.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border-2 border-gray-100 p-5 blur-sm opacity-70"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary-light text-primary text-xs font-semibold">
                      {CATEGORY_LABELS[opp.category] ?? opp.category}
                    </span>
                    <span className="text-xs text-slate-mid">{ZONE_LABELS[opp.country] ?? opp.country}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-dark leading-snug">{opp.title}</p>
                </div>
              </div>
              {opp.short_description && (
                <p className="text-xs text-slate-mid leading-relaxed line-clamp-2">{opp.short_description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-white/60 to-white rounded-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-primary/20 p-5 mx-4 text-center shadow-sm">
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-base font-black text-slate-dark mb-1">
              {totalCount} opportunités actives
            </p>
            <p className="text-xs text-slate-mid">accessibles aux abonnés Guide Premium</p>
          </div>
        </div>
      </div>

      {/* Bénéfices */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
        <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-4">Ce que tu obtiens</h2>
        <ul className="space-y-3">
          {BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">{b.icon}</span>
              <span className="text-sm text-slate-dark">{b.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tarifs */}
      <div className="space-y-3">
        {/* Annuel — mis en avant */}
        <div className="relative bg-primary rounded-2xl p-5 text-white">
          <span className="absolute -top-2.5 left-4 inline-flex items-center h-5 px-2.5 rounded-full bg-orange-400 text-white text-xs font-bold">
            Meilleur plan
          </span>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-black">Annuel</p>
              <p className="text-xs opacity-80">Économise 2 mois</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">19 900 XOF</p>
              <p className="text-xs opacity-80">/ an</p>
            </div>
          </div>
        </div>

        {/* Mensuel */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-slate-dark">Mensuel</p>
              <p className="text-xs text-slate-mid">Sans engagement</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-slate-dark">2 500 XOF</p>
              <p className="text-xs text-slate-mid">/ mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Link
          href="/guide-premium"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors"
        >
          Accéder au Guide Premium →
        </Link>

        {/* Note liste d'attente */}
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-700 font-semibold mb-1">
            Paiement bientôt disponible
          </p>
          <p className="text-xs text-orange-600">
            Rejoins la liste d&apos;attente pour être notifié en premier.{" "}
            <a
              href="mailto:hello@kraak.co?subject=Liste%20d%27attente%20Guide%20Premium"
              className="underline font-semibold"
            >
              S&apos;inscrire →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
