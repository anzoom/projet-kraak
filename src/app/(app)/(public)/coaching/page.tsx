"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import posthog from "posthog-js"

const CALENDLY_URL = "https://calendly.com/anzoomc/30min"
const WHATSAPP_NUMBER = "33768251709"
const WHATSAPP_AFTER_BOOKING = `Bonjour, je viens de réserver un créneau coaching sur KRAAK mais je n'ai pas Zoom. Peut-on organiser l'appel via WhatsApp ?`

const OFFERS = [
  {
    id: "audit",
    emoji: "📋",
    title: "Audit de dossier",
    description: "Un expert analyse ton dossier et te donne un plan d'action concret pour maximiser tes chances sur tes opportunités cibles.",
    features: [
      "Analyse complète de ton CV et lettre de motivation",
      "Identification des points forts et points faibles",
      "Plan d'action prioritaire et personnalisé",
      "Retour sous 48h",
    ],
    cta: "Réserver mon audit",
    highlight: false,
  },
  {
    id: "accompagnement",
    emoji: "🎯",
    title: "Accompagnement complet",
    description: "Un coach dédié t'accompagne de A à Z sur ta candidature : de la stratégie à la soumission finale.",
    features: [
      "Stratégie de candidature personnalisée",
      "Rédaction et optimisation des documents",
      "Préparation aux entretiens",
      "Suivi jusqu'à la décision finale",
    ],
    cta: "Réserver un appel",
    highlight: true,
  },
]

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void
    }
  }
}

export default function CoachingPage() {
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.head.appendChild(script)

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    document.head.appendChild(link)

    function handleMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        setBooked(true)
        posthog.capture("coaching_booked")
      }
    }
    window.addEventListener("message", handleMessage)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(link)
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  function openCalendly(offerId: string) {
    posthog.capture("coaching_calendly_clicked", { offer: offerId })
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL })
  }

  return (
    <div className="min-h-screen bg-slate-light">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux résultats
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-4xl mb-4">🔥</p>
          <h1 className="text-3xl font-black text-slate-dark tracking-tight mb-3">
            Maximise tes chances d'acceptation
          </h1>
          <p className="text-slate-mid text-base leading-relaxed max-w-md mx-auto">
            Nos coachs t'aident à transformer tes opportunités en admissions. Choisis la formule adaptée à ton projet.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              id={offer.id === "accompagnement" ? "accompagnement" : undefined}
              className={[
                "bg-white rounded-2xl border-2 p-6",
                offer.highlight ? "border-primary" : "border-gray-100",
              ].join(" ")}
            >
              {offer.highlight && (
                <span className="inline-flex items-center h-6 px-3 rounded-full bg-primary text-white text-xs font-bold mb-4">
                  Le plus populaire
                </span>
              )}
              <p className="text-2xl mb-2">{offer.emoji}</p>
              <h2 className="text-xl font-black text-slate-dark mb-2">{offer.title}</h2>
              <p className="text-slate-mid text-sm mb-4 leading-relaxed">{offer.description}</p>
              <ul className="space-y-2 mb-6">
                {offer.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-dark">
                    <span className="text-primary mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openCalendly(offer.id)}
                className={[
                  "w-full h-12 rounded-full font-bold text-sm transition-colors inline-flex items-center justify-center gap-2",
                  offer.highlight
                    ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                ].join(" ")}
              >
                {offer.cta} →
              </button>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-slate-mid">ou</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_AFTER_BOOKING)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture("coaching_whatsapp_clicked", { offer: offer.id })}
                className="w-full h-11 rounded-full border-2 border-gray-200 text-slate-mid font-semibold text-sm hover:border-green-400 hover:text-green-700 transition-colors inline-flex items-center justify-center gap-2 mt-1"
              >
                Pas de Zoom ? WhatsApp →
              </a>
            </div>
          ))}
        </div>

        {booked && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center mb-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-slate-dark mb-1">Créneau réservé !</p>
            <p className="text-sm text-slate-mid mb-4">
              Tu vas recevoir un email de confirmation. L'appel se fait par défaut sur Zoom.
            </p>
            <p className="text-sm font-semibold text-slate-dark mb-3">
              Tu n'as pas Zoom ?
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_AFTER_BOOKING)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog.capture("coaching_whatsapp_after_booking")}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
            >
              Organiser via WhatsApp →
            </a>
          </div>
        )}

        <p className="text-center text-xs text-slate-mid">
          Tu as des questions ?{" "}
          <a href="mailto:coaching@kraak.co" className="underline hover:text-slate-dark transition-colors">
            Contacte-nous
          </a>
        </p>
      </main>
    </div>
  )
}
