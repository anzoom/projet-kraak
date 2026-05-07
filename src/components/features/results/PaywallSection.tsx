import Link from "next/link"
import type { Recommendation } from "@/types/scoring"

interface Props {
  locked: Recommendation[]
  totalCount: number
  isAuthenticated?: boolean
}

export default function PaywallSection({ locked, totalCount, isAuthenticated = false }: Props) {
  if (locked.length === 0) return null

  return (
    <div className="w-full">
      {isAuthenticated ? null : (
        // Utilisateur non connecté — auth gate
        <div className="bg-gradient-to-br from-primary-light to-orange-50 rounded-2xl border-2 border-orange-200 p-6 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <h3 className="text-lg font-black text-slate-dark mb-2">
            {totalCount} opportunités trouvées pour toi
          </h3>
          <p className="text-slate-mid text-sm mb-5 leading-relaxed">
            Crée ton compte gratuit en 1 minute pour accéder à tes recommandations personnalisées
            et rejoindre la bêta KRAAK.
          </p>
          <Link
            href="/auth/register?next=/results"
            className="inline-flex items-center justify-center w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-orange-200 transition-colors mb-3"
          >
            Créer mon compte gratuit →
          </Link>
          <Link
            href="/auth/login?next=/results"
            className="inline-flex items-center justify-center w-full h-10 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-white transition-colors"
          >
            J&apos;ai déjà un compte — Se connecter
          </Link>
        </div>
      )}

      <div className="space-y-3 mt-6">
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
              <span className="text-slate-mid text-sm font-semibold">🔒 Bientôt disponible</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
