"use client"

import { useState } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ConfirmErrorPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/results&from=test`,
      },
    })

    if (resendError) {
      setError("Impossible d'envoyer le lien. Vérifie l'adresse email.")
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm text-center">
      <p className="text-5xl mb-4">🔗</p>
      <h2 className="text-xl font-bold text-slate-dark mb-2">Lien invalide ou expiré</h2>
      <p className="text-slate-mid text-sm mb-6">
        Ce lien de confirmation n'est plus valide. Il a peut-être expiré ou déjà été utilisé.
        Saisis ton adresse email pour recevoir un nouveau lien.
      </p>

      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-4 text-sm text-green-700">
          Lien envoyé ! Vérifie ta boîte mail.
        </div>
      ) : (
        <form onSubmit={handleResend} className="flex flex-col gap-3 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-dark">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="h-12 px-4 rounded-xl border-2 border-gray-200 text-slate-dark text-base focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={[
              "h-12 rounded-full font-semibold text-sm transition-all",
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100",
            ].join(" ")}
          >
            {loading ? "Envoi en cours…" : "Renvoyer le lien"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-slate-mid">
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
