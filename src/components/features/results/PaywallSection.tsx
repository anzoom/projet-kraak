import Link from "next/link"
import type { Recommendation } from "@/types/scoring"

interface Props {
  locked: Recommendation[]
}

export default function PaywallSection({ locked }: Props) {
  if (locked.length === 0) return null

  return (
    <div className="w-full">
      <div className="space-y-3 mb-6">
        {locked.map((rec) => (
          <div
            key={rec.opportunity.id}
            className="relative bg-white rounded-2xl border-2 border-gray-100 p-5 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 w-12 bg-gray-200 rounded-full" />
            </div>
            <p className="text-base font-bold text-slate-dark leading-snug mb-2">
              {rec.opportunity.title}
            </p>
            <div className="flex gap-2">
              <div className="h-5 w-28 bg-gray-100 rounded-full" />
              <div className="h-5 w-24 bg-gray-100 rounded-full" />
            </div>
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-slate-mid text-sm font-semibold">🔒 Verrouillé</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary-light to-orange-50 rounded-2xl border-2 border-orange-200 p-6 text-center">
        <p className="text-2xl mb-2">🔓</p>
        <h3 className="text-lg font-black text-slate-dark mb-1">
          {locked.length} opportunité{locked.length > 1 ? "s" : ""} supplémentaire
          {locked.length > 1 ? "s" : ""} verrouillée{locked.length > 1 ? "s" : ""}
        </h3>
        <p className="text-slate-mid text-sm mb-4">
          Accède à la liste complète de tes recommandations personnalisées avec
          toutes les informations pour postuler.
        </p>

        <div className="mb-4">
          <p className="text-3xl font-black text-slate-dark">
            2 500 <span className="text-xl">FCFA</span>
          </p>
          <p className="text-xs text-slate-mid mt-0.5">Paiement unique — accès immédiat</p>
        </div>

        <Link
          href={`/payment?locked_count=${locked.length}`}
          className="inline-flex items-center justify-center w-full h-13 rounded-full bg-primary text-white font-bold text-base hover:bg-primary-dark shadow-md shadow-orange-200 transition-colors"
        >
          Débloquer mes recommandations
        </Link>

        <p className="text-xs text-slate-mid mt-3">
          🔒 Accès immédiat et sécurisé · Paiement Mobile Money
        </p>
      </div>
    </div>
  )
}
