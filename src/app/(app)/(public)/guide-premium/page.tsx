import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Bell, Users, Zap, Check, X } from "lucide-react"
import BetaCapture from "@/components/features/waitlist/BetaCapture"

export const metadata: Metadata = {
  title: "KRAAK Guide Premium — Bientôt disponible",
}

const UPCOMING = [
  {
    icon: "📚",
    title: "9 modules de formation",
    desc: "Du mindset à la stratégie avancée : dossier, rédaction, entretien, stratégie internationale…",
    highlight: false,
  },
  {
    icon: "🎯",
    title: "Jusqu'à 20 recommandations",
    desc: "2× plus de recommandations personnalisées selon ton profil et tes objectifs.",
    highlight: false,
  },
  {
    icon: "🔖",
    title: "Gestion des favoris",
    desc: "Sauvegarde et organise tes opportunités préférées. Retrouve-les facilement et suis leur statut.",
    highlight: true,
  },
  {
    icon: "🔔",
    title: "Alertes deadlines personnalisées",
    desc: "Reçois une notification 90, 30 et 7 jours avant chaque deadline pour ne jamais rater une candidature.",
    highlight: true,
  },
  {
    icon: "📬",
    title: "Newsletter mensuelle",
    desc: "Les meilleures opportunités du mois, deadlines à ne pas manquer, conseils de candidature.",
    highlight: false,
  },
]

export default function GuidePremiumPage() {
  return (
    <div className="bg-slate-light">
      <main className="max-w-lg mx-auto px-4 py-10 space-y-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Guide
        </Link>

        {/* Hero */}
        <div className="text-center space-y-3">
          <p className="text-5xl">📚</p>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-primary-light text-primary text-xs font-bold">
              Phase bêta gratuite
            </span>
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-green-100 text-green-700 text-xs font-bold">
              Lancement imminent
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight leading-tight">
            Le Guide Premium arrive.
            <br />
            <span className="text-primary">Sois parmi les premiers.</span>
          </h1>
          <p className="text-slate-mid text-sm leading-relaxed max-w-sm mx-auto">
            KRAAK construit le guide de référence pour les étudiants africains qui veulent décrocher
            les meilleures opportunités. Rejoins la liste pour y accéder en avant-première,
            gratuitement.
          </p>
        </div>

        {/* Comparaison Classic vs Premium */}
        <div className="grid grid-cols-2 gap-3">
          {/* Classic */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-bold text-slate-mid uppercase tracking-widest mb-0.5">Gratuit</p>
              <p className="text-base font-black text-slate-dark">Classic</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-dark leading-none">5</p>
              <p className="text-xs text-slate-mid mt-0.5">recommandations max.</p>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              {[
                { label: "Recommandations", ok: true },
                { label: "Favoris", ok: false },
                { label: "Guide formation", ok: false },
                { label: "Alertes deadlines", ok: false },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-1.5">
                  {row.ok
                    ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    : <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                  <span className={["text-xs", row.ok ? "text-slate-dark font-medium" : "text-gray-300"].join(" ")}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="bg-primary rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Premium</p>
              <p className="text-base font-black text-white">Guide</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white leading-none">20</p>
              <p className="text-xs text-white/70 mt-0.5">recommandations max.</p>
            </div>
            <div className="border-t border-white/20 pt-3 space-y-2">
              {[
                { label: "Recommandations", sub: "×2" },
                { label: "15 favoris max", sub: null },
                { label: "9 modules formation", sub: null },
                { label: "Alertes deadlines", sub: null },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-white/80 shrink-0" />
                  <span className="text-xs text-white font-medium">{row.label}</span>
                  {row.sub && (
                    <span className="text-[10px] font-bold text-white/60 bg-white/10 px-1.5 rounded-full">{row.sub}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ce qui arrive */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider">
              Ce qui arrive bientôt
            </h2>
          </div>
          <div className="space-y-4">
            {UPCOMING.map((item) => (
              <div
                key={item.title}
                className={[
                  "flex items-start gap-4 rounded-xl p-3 -mx-3",
                  item.highlight ? "bg-primary/5 border border-primary/15" : "",
                ].join(" ")}
              >
                <span className="text-2xl leading-none shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-slate-dark">{item.title}</p>
                    {item.highlight && (
                      <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-mid leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire waitlist */}
        <BetaCapture
          source="guide-premium"
          title="Rejoindre la liste d'attente"
          subtitle="Sélectionne ce qui t'intéresse — on te prévient en avant-première."
          ctaLabel="Être prévenu en premier →"
          compact={false}
        />

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-slate-dark">Bêta</span>
            </div>
            <p className="text-xs text-slate-mid">Testeurs actifs</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-slate-dark">9 modules</span>
            </div>
            <p className="text-xs text-slate-mid">En cours de création</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-slate-dark">Gratuit</span>
            </div>
            <p className="text-xs text-slate-mid">Pendant la bêta</p>
          </div>
        </div>

        {/* Réassurance */}
        <div className="text-center space-y-1.5 pb-4">
          <p className="text-xs text-slate-mid">
            Des questions ?{" "}
            <a href="mailto:hello@kraak.co" className="underline hover:text-slate-dark transition-colors">
              hello@kraak.co
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
