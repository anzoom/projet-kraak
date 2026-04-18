"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const AMOUNT_DISPLAY = "2 500"
const STORAGE_KEY_SESSION = "kraak_anonymous_session"

interface Props {
  lockedCount: number
}

export default function PaymentForm({ lockedCount }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setError(null)
    setLoading(true)

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION)
      const answers = raw
        ? (JSON.parse(raw) as { answers?: Record<string, string> }).answers
        : null

      if (!answers || Object.keys(answers).length === 0) {
        router.push("/test")
        return
      }

      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? "Une erreur est survenue. Réessaie dans quelques instants.")
        setLoading(false)
        return
      }

      const { payment_url } = (await res.json()) as { payment_url: string }
      window.location.href = payment_url
    } catch {
      setError("Impossible de contacter le serveur. Vérifie ta connexion.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">🔓</p>
        <h1 className="text-2xl font-black text-slate-dark tracking-tight mb-2">
          Débloque tes résultats
        </h1>
        <p className="text-slate-mid text-sm">
          {lockedCount} opportunité{lockedCount > 1 ? "s" : ""} supplémentaire
          {lockedCount > 1 ? "s" : ""} t'attendent
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 mb-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-mid">Accès complet</span>
          <span className="font-bold text-slate-dark">{AMOUNT_DISPLAY} FCFA</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-mid">Durée</span>
          <span className="font-medium text-slate-dark">6 mois</span>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-slate-mid mb-2">Modes de paiement acceptés :</p>
          <div className="flex gap-2 flex-wrap">
            {["Orange Money", "MTN MoMo", "Wave", "Moov Money"].map((m) => (
              <span
                key={m}
                className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-slate-mid"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className={[
          "w-full h-13 rounded-full font-bold text-base transition-all",
          loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100",
        ].join(" ")}
      >
        {loading ? "Redirection vers le paiement…" : `Payer ${AMOUNT_DISPLAY} FCFA`}
      </button>

      <p className="text-xs text-slate-mid text-center mt-4">
        🔒 Paiement sécurisé via CinetPay · Accès immédiat après confirmation
      </p>
    </div>
  )
}
