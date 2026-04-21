"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
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

export default function CoachingPage() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  const visibleDays = DAYS.slice(weekOffset * 6, weekOffset * 6 + 6)
  const hasNextWeek = (weekOffset + 1) * 6 < DAYS.length

  function handleDaySelect(day: Date) {
    setSelectedDay(day)
    setSelectedSlot(null)
  }

  function buildWhatsAppMessage(day: Date, slot: string): string {
    const dayLabel = `${DAY_NAMES_LONG[day.getDay()]} ${day.getDate()} ${MONTH_NAMES_LONG[day.getMonth()]}`
    return `Bonjour, je souhaite réserver un call coaching KRAAK le ${dayLabel} à ${slot}. Est-ce que ce créneau est disponible ?`
  }

  function handleBook() {
    if (!selectedDay || !selectedSlot) return
    posthog.capture("coaching_slot_booked", {
      day: selectedDay.toISOString().slice(0, 10),
      slot: selectedSlot,
    })
    const msg = buildWhatsAppMessage(selectedDay, selectedSlot)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
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

      <main className="max-w-lg mx-auto px-4 py-10 space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-3">📞</p>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight mb-2">
            Réserve ton call coaching
          </h1>
          <p className="text-slate-mid text-sm leading-relaxed">
            45 min en appel WhatsApp avec un coach. Choisis un créneau disponible.
          </p>
        </div>

        {/* Sélection du jour */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-dark">Choisis un jour</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
                disabled={weekOffset === 0}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-mid hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setWeekOffset((v) => v + 1)}
                disabled={!hasNextWeek}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-mid hover:bg-gray-100 disabled:opacity-30 transition-colors"
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
                  onClick={() => handleDaySelect(day)}
                  className={[
                    "flex flex-col items-center py-3 rounded-xl border-2 text-xs font-semibold transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-100 hover:border-primary/40 text-slate-dark",
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
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
            <h2 className="text-sm font-bold text-slate-dark mb-4">
              Créneaux disponibles — {DAY_NAMES_LONG[selectedDay.getDay()]} {selectedDay.getDate()} {MONTH_NAMES_LONG[selectedDay.getMonth()]}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={[
                      "h-11 rounded-xl border-2 text-sm font-semibold transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-100 hover:border-primary/40 text-slate-dark",
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
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-5 text-center space-y-4">
            <p className="text-sm text-slate-mid">
              Tu as choisi le{" "}
              <span className="font-bold text-slate-dark">
                {DAY_NAMES_LONG[selectedDay.getDay()]} {selectedDay.getDate()} {MONTH_NAMES_LONG[selectedDay.getMonth()]} à {selectedSlot}
              </span>
            </p>
            <button
              onClick={handleBook}
              className="w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-orange-100 transition-colors"
            >
              Confirmer sur WhatsApp →
            </button>
            <p className="text-xs text-slate-mid">
              Un message sera envoyé à notre coach pour valider le créneau.
            </p>
          </div>
        )}

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
