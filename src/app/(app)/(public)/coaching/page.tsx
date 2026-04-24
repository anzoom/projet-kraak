"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react"
import posthog from "posthog-js"

const WHATSAPP_NUMBER = "33768251709"

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const DAY_NAMES_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const MONTH_NAMES = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"]
const MONTH_NAMES_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

function generateSlots(): string[] {
  const slots: string[] = []
  let h = 11, m = 0
  while (h * 60 + m + 45 <= 16 * 60) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    m += 45
    if (m >= 60) { h += 1; m -= 60 }
  }
  return slots
}

function generateAvailableDays(count = 12): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 1)
  while (days.length < count) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

const SLOTS = generateSlots()
const DAYS = generateAvailableDays()

const OFFERS = [
  {
    id: "audit",
    emoji: "📋",
    title: "Audit de dossier",
    price: "15 000 FCFA",
    description: "Un expert analyse ton dossier et te donne un plan d'action concret pour maximiser tes chances.",
    features: [
      "Analyse complète de ton CV et lettre de motivation",
      "Identification des points forts et points faibles",
      "Plan d'action prioritaire et personnalisé",
      "Retour sous 48h",
    ],
    highlight: false,
  },
  {
    id: "accompagnement",
    emoji: "🎯",
    title: "Accompagnement complet",
    price: "50 000 FCFA",
    description: "Un coach dédié t'accompagne de A à Z sur ta candidature : de la stratégie à la soumission finale.",
    features: [
      "Stratégie de candidature personnalisée",
      "Rédaction et optimisation des documents",
      "Préparation aux entretiens",
      "Suivi jusqu'à la décision finale",
    ],
    highlight: true,
  },
]

type BookedSlot = { date: string; slot: string; status: string }

function BookingCalendar({ offerId, offerTitle }: { offerId: string; offerTitle: string }) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    fetch("/api/coaching/slots")
      .then((r) => r.json())
      .then((data: { bookings: BookedSlot[] }) => setBookedSlots(data.bookings))
      .catch(() => {})
  }, [])

  const visibleDays = DAYS.slice(weekOffset * 6, weekOffset * 6 + 6)
  const hasNextWeek = (weekOffset + 1) * 6 < DAYS.length

  function isSlotBooked(day: Date, slot: string): boolean {
    const dateStr = day.toISOString().slice(0, 10)
    return bookedSlots.some((b) => b.date === dateStr && b.slot === slot)
  }

  function buildWhatsAppMessage(day: Date, slot: string): string {
    const dayLabel = `${DAY_NAMES_LONG[day.getDay()]} ${day.getDate()} ${MONTH_NAMES_LONG[day.getMonth()]}`
    return `Bonjour, je souhaite réserver un call coaching KRAAK (${offerTitle}) le ${dayLabel} à ${slot}. Est-ce que ce créneau est disponible ?`
  }

  async function handleBook() {
    if (!selectedDay || !selectedSlot || booking) return
    setBooking(true)
    const dateStr = selectedDay.toISOString().slice(0, 10)
    try {
      const res = await fetch("/api/coaching/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, slot: selectedSlot }),
      })
      if (res.status === 409) {
        setBookedSlots((prev) => [...prev, { date: dateStr, slot: selectedSlot, status: "PENDING" }])
        setSelectedSlot(null)
        setBooking(false)
        return
      }
      posthog.capture("coaching_slot_booked", { day: dateStr, slot: selectedSlot, offer: offerId })
      setBookedSlots((prev) => [...prev, { date: dateStr, slot: selectedSlot, status: "PENDING" }])
      setBooked(true)
      const msg = buildWhatsAppMessage(selectedDay, selectedSlot)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
    } catch {
      const msg = buildWhatsAppMessage(selectedDay!, selectedSlot!)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
    } finally {
      setBooking(false)
    }
  }

  if (booked) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center mt-4">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-slate-dark mb-1">Créneau réservé !</p>
        <p className="text-sm text-slate-mid">
          Un message WhatsApp a été envoyé. Le coach te contactera pour confirmer.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Sélection du jour */}
      <div className="bg-slate-light rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-mid uppercase tracking-wider">Choisis un jour</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
              disabled={weekOffset === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-mid hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset((v) => v + 1)}
              disabled={!hasNextWeek}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-mid hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {visibleDays.map((day) => {
            const isSelected = selectedDay?.toDateString() === day.toDateString()
            return (
              <button
                key={day.toISOString()}
                onClick={() => { setSelectedDay(day); setSelectedSlot(null) }}
                className={[
                  "flex flex-col items-center py-2.5 rounded-xl border-2 text-xs font-semibold transition-colors",
                  isSelected ? "border-primary bg-primary text-white" : "border-gray-200 bg-white hover:border-primary/40 text-slate-dark",
                ].join(" ")}
              >
                <span className={isSelected ? "text-white/70" : "text-slate-mid"}>{DAY_NAMES[day.getDay()]}</span>
                <span className="text-base font-black mt-0.5">{day.getDate()}</span>
                <span className={isSelected ? "text-white/70" : "text-slate-mid"}>{MONTH_NAMES[day.getMonth()]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sélection du créneau */}
      {selectedDay && (
        <div className="bg-slate-light rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-3">
            Créneaux — {DAY_NAMES_LONG[selectedDay.getDay()]} {selectedDay.getDate()} {MONTH_NAMES_LONG[selectedDay.getMonth()]}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot
              const isBooked = isSlotBooked(selectedDay, slot)
              return (
                <button
                  key={slot}
                  onClick={() => !isBooked && setSelectedSlot(slot)}
                  disabled={isBooked}
                  className={[
                    "h-10 rounded-xl border-2 text-sm font-semibold transition-colors",
                    isBooked ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      : isSelected ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white hover:border-primary/40 text-slate-dark",
                  ].join(" ")}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedDay && selectedSlot && (
        <div className="rounded-2xl border-2 border-primary/20 bg-orange-50 p-4 space-y-3">
          <p className="text-sm text-slate-mid">
            Créneau sélectionné :{" "}
            <span className="font-bold text-slate-dark">
              {DAY_NAMES_LONG[selectedDay.getDay()]} {selectedDay.getDate()} {MONTH_NAMES_LONG[selectedDay.getMonth()]} à {selectedSlot}
            </span>
          </p>
          {/* Placeholder paiement — à intégrer */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-mid">💳 Paiement en ligne — bientôt disponible</p>
          </div>
          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-orange-100 transition-colors disabled:opacity-60"
          >
            {booking ? "Réservation…" : "Confirmer sur WhatsApp →"}
          </button>
          <p className="text-xs text-slate-mid text-center">
            Le paiement s'effectuera lors de la confirmation avec le coach.
          </p>
        </div>
      )}
    </div>
  )
}

export default function CoachingPage() {
  const [openOffer, setOpenOffer] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash === "audit" || hash === "accompagnement") {
      setOpenOffer(hash)
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [])

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

      <main className="max-w-lg mx-auto px-4 py-10 space-y-5">
        <div className="text-center">
          <p className="text-4xl mb-3">🔥</p>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight mb-2">
            Maximise tes chances d'acceptation
          </h1>
          <p className="text-slate-mid text-sm leading-relaxed">
            Choisis la formule adaptée à ton projet et réserve un créneau.
          </p>
        </div>

        {OFFERS.map((offer) => {
          const isOpen = openOffer === offer.id
          return (
            <div
              key={offer.id}
              id={offer.id}
              className={[
                "bg-white rounded-2xl border-2 p-6 scroll-mt-6",
                offer.highlight ? "border-primary" : "border-gray-100",
              ].join(" ")}
            >
              {offer.highlight && (
                <span className="inline-flex items-center h-6 px-3 rounded-full bg-primary text-white text-xs font-bold mb-4">
                  Le plus populaire
                </span>
              )}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-2xl mb-1">{offer.emoji}</p>
                  <h2 className="text-xl font-black text-slate-dark">{offer.title}</h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-primary">{offer.price}</p>
                  <p className="text-xs text-slate-mid">session 45 min</p>
                </div>
              </div>

              <p className="text-slate-mid text-sm mb-4 leading-relaxed">{offer.description}</p>

              <ul className="space-y-2 mb-5">
                {offer.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-dark">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  posthog.capture("coaching_offer_selected", { offer: offer.id })
                  setOpenOffer(isOpen ? null : offer.id)
                }}
                className={[
                  "w-full h-12 rounded-full font-bold text-sm transition-colors",
                  isOpen
                    ? "border-2 border-gray-200 text-slate-mid hover:bg-gray-50"
                    : offer.highlight
                      ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                ].join(" ")}
              >
                {isOpen ? "Masquer les créneaux" : "Choisir cette offre →"}
              </button>

              {isOpen && <BookingCalendar offerId={offer.id} offerTitle={offer.title} />}
            </div>
          )
        })}

        <p className="text-center text-xs text-slate-mid">
          Des questions ?{" "}
          <a href="mailto:coaching@kraak.co" className="underline hover:text-slate-dark transition-colors">
            coaching@kraak.co
          </a>
        </p>
      </main>
    </div>
  )
}
