import Link from "next/link"
import { ArrowLeft, BookOpen, Users, ShieldCheck, Plane } from "lucide-react"
import BetaCapture from "@/components/features/waitlist/BetaCapture"

const SECTIONS = [
  {
    label: "Conseil individuel",
    offers: [
      {
        id: "audit",
        icon: <BookOpen className="w-5 h-5 text-primary" />,
        iconBg: "bg-primary/10",
        title: "Audit de dossier",
        badge: null,
        description:
          "Un expert analyse ton CV et ta lettre de motivation puis te donne un plan d'action concret pour maximiser tes chances.",
        theme: "light" as const,
      },
      {
        id: "accompagnement",
        icon: <Users className="w-5 h-5 text-white" />,
        iconBg: "bg-white/20",
        title: "Accompagnement complet",
        badge: "Le plus demandé",
        description:
          "Un conseiller dédié t'accompagne de A à Z : de la stratégie à la soumission finale, tu n'es jamais seul.",
        theme: "orange" as const,
      },
    ],
  },
  {
    label: "Services pratiques",
    offers: [
      {
        id: "visa",
        icon: <ShieldCheck className="w-5 h-5 text-primary" />,
        iconBg: "bg-primary/10",
        title: "Aide démarches visa",
        badge: "Bientôt",
        description:
          "Le refus de visa est la première cause d'abandon d'une opportunité internationale. On t'aide à soumettre un dossier solide dès la première tentative.",
        theme: "light" as const,
      },
      {
        id: "voyage",
        icon: <Plane className="w-5 h-5 text-white" />,
        iconBg: "bg-white/20",
        title: "Voyage & Hébergement",
        badge: "Bientôt",
        description:
          "Avoir une bourse, c'est bien. Savoir comment arriver sereinement sans dépenser le double du prévu, c'est mieux.",
        theme: "orange" as const,
      },
    ],
  },
]

export default function CoachingPage() {
  return (
    <div className="bg-slate-light">
      <main className="max-w-lg mx-auto px-4 py-10 space-y-8">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux résultats
        </Link>

        <div className="text-center">
          <p className="text-4xl mb-3">🔥</p>
          <span className="inline-flex items-center h-6 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            Bientôt disponible
          </span>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight mb-2">
            Au-delà des opportunités, un vrai coup de main
          </h1>
          <p className="text-slate-mid text-sm leading-relaxed max-w-sm mx-auto">
            Trouver l&apos;opportunité, c&apos;est la première étape. On te prépare pour tout le reste :
            dossier, visa, départ.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.label} className="space-y-3">
            <p className="text-xs font-bold text-slate-mid uppercase tracking-widest px-1">
              {section.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.offers.map((offer) => (
                <div
                  key={offer.id}
                  id={offer.id}
                  className={[
                    "rounded-2xl p-5 scroll-mt-6",
                    offer.theme === "orange"
                      ? "bg-primary"
                      : "bg-white border-2 border-gray-100",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={["w-10 h-10 rounded-xl flex items-center justify-center", offer.iconBg].join(" ")}>
                      {offer.icon}
                    </div>
                    {offer.badge && (
                      <span className={[
                        "inline-flex items-center h-6 px-2.5 rounded-full text-xs font-bold",
                        offer.theme === "orange"
                          ? "bg-white/20 text-white"
                          : offer.badge === "Le plus demandé"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-slate-mid",
                      ].join(" ")}>
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  <h2 className={["text-base font-black mb-2", offer.theme === "orange" ? "text-white" : "text-slate-dark"].join(" ")}>
                    {offer.title}
                  </h2>
                  <p className={["text-xs leading-relaxed", offer.theme === "orange" ? "text-white/80" : "text-slate-mid"].join(" ")}>
                    {offer.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <BetaCapture
          source="coaching"
          title="Être prévenu au lancement"
          subtitle="Dis-nous ce qui t'intéresse — on te prévient en avant-première."
          ctaLabel="Je veux être prévenu →"
        />

        <p className="text-center text-xs text-slate-mid pb-4">
          Des questions ?{" "}
          <a href="mailto:hello@kraak.co" className="underline hover:text-slate-dark transition-colors">
            hello@kraak.co
          </a>
        </p>
      </main>
    </div>
  )
}
