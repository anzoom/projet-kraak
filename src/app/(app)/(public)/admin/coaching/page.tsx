"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

const DAY_NAMES_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const MONTH_NAMES_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

function formatDateLabel(dateStr: string, slot: string): string {
  const d = new Date(dateStr + "T12:00:00")
  return `${DAY_NAMES_LONG[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_LONG[d.getMonth()]} à ${slot}`
}

type Booking = {
  id: string
  date: string
  slot: string
  email: string | null
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  expires_at: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-orange-50 text-orange-600 border border-orange-200",
  CONFIRMED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-gray-100 text-gray-400 border border-gray-200",
}

function AdminCoachingContent() {
  const searchParams = useSearchParams()
  const secret = searchParams.get("secret") ?? ""

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    if (!secret) { setAuthorized(false); setLoading(false); return }
    fetch("/api/coaching/slots?all=1&secret=" + encodeURIComponent(secret))
      .then((r) => {
        if (r.status === 401) { setAuthorized(false); return null }
        return r.json()
      })
      .then((data: { bookings: Booking[] } | null) => {
        if (data) setBookings(data.bookings)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [secret])

  async function updateStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
    setActing(id)
    try {
      const res = await fetch(`/api/coaching/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const data = (await res.json()) as { booking: Booking }
        setBookings((prev) => prev.map((b) => b.id === id ? data.booking : b))
      }
    } finally {
      setActing(null)
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-light">
        <p className="text-slate-mid text-sm">Accès non autorisé.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-light">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pending = bookings.filter((b) => b.status === "PENDING")
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED")
  const cancelled = bookings.filter((b) => b.status === "CANCELLED")
  const ordered = [...pending, ...confirmed, ...cancelled]

  return (
    <div className="bg-slate-light">
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-mid uppercase tracking-wider">Coaching admin</p>
          {pending.length > 0 && (
            <span className="text-xs font-semibold text-primary">{pending.length} en attente</span>
          )}
        </div>
        {ordered.length === 0 && (
          <p className="text-center text-slate-mid text-sm py-12">Aucune réservation pour le moment.</p>
        )}

        {ordered.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold text-slate-dark text-sm">{formatDateLabel(b.date, b.slot)}</p>
                {b.email && <p className="text-xs text-slate-mid mt-0.5">{b.email}</p>}
                <p className="text-xs text-slate-mid mt-0.5">
                  Réservé le {new Date(b.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLE[b.status]}`}>
                {STATUS_LABEL[b.status]}
              </span>
            </div>

            {b.status === "PENDING" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(b.id, "CONFIRMED")}
                  disabled={acting === b.id}
                  className="flex-1 h-10 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {acting === b.id ? "…" : "✓ Confirmer"}
                </button>
                <button
                  onClick={() => updateStatus(b.id, "CANCELLED")}
                  disabled={acting === b.id}
                  className="flex-1 h-10 rounded-full border-2 border-gray-200 text-slate-mid font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            )}

            {b.status === "CONFIRMED" && (
              <button
                onClick={() => updateStatus(b.id, "CANCELLED")}
                disabled={acting === b.id}
                className="w-full h-10 rounded-full border-2 border-gray-200 text-slate-mid font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default function AdminCoachingPage() {
  return (
    <Suspense>
      <AdminCoachingContent />
    </Suspense>
  )
}
