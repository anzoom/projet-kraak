import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Users } from "lucide-react"
import Footer from "@/components/features/landing/Footer"

export const metadata: Metadata = {
  title: "Contact — KRAAK",
  description: "Contacte l'équipe KRAAK pour toute question, feedback ou demande de partenariat.",
}

const contacts = [
  {
    icon: Mail,
    label: "Support & feedback",
    email: "contact@kraak.co",
    description: "Questions générales, retours produit, signalement de bugs, suggestions",
    delay: "48h ouvrables",
  },
  {
    icon: Mail,
    label: "Données personnelles",
    email: "privacy@kraak.co",
    description: "Accès, rectification, suppression de tes données",
    delay: "30 jours (délai légal)",
  },
  {
    icon: Users,
    label: "Partenariats & presse",
    email: "partnerships@kraak.co",
    description: "Partenariats institutionnels, opportunités sponsorisées, presse",
    delay: "5 jours ouvrables",
  },
]

export default function ContactPage() {
  return (
    <div className="bg-slate-light min-h-screen">
      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary font-medium hover:underline">← Retour à l&apos;accueil</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Contact</h1>
          <p className="text-sm text-gray-500 mb-3">
            KRAAK est disponible du lundi au vendredi. Choisis le bon canal pour une réponse rapide.
          </p>
          <p className="text-xs text-gray-500 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
            KRAAK est actuellement en <strong>phase bêta gratuite</strong>. Aucune offre payante n&apos;est active à ce stade.
          </p>
        </div>

        <div className="space-y-3">
          {contacts.map((c) => (
            <a
              key={c.email}
              href={`mailto:${c.email}`}
              className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-primary hover:shadow-sm transition-all group"
            >
              <div className="mt-0.5 p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <c.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900">{c.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-1">{c.description}</p>
                <p className="text-xs font-medium text-primary">{c.email}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400">Réponse sous</span>
                <p className="text-xs font-medium text-gray-600">{c.delay}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Tu peux aussi consulter nos{" "}
            <Link href="/conditions" className="text-primary hover:underline">CGU</Link>
            {" "}et notre{" "}
            <Link href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
