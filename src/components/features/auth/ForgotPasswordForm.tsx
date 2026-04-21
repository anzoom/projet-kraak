"use client"

import { useState } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (resetError) {
      setError("Une erreur est survenue. Vérifie l'adresse email et réessaie.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-5xl mb-4">📬</p>
        <h2 className="text-xl font-bold text-slate-dark mb-2">Vérifie ta boîte mail</h2>
        <p className="text-slate-mid text-sm mb-1">
          Un lien de réinitialisation a été envoyé à
        </p>
        <p className="font-semibold text-slate-dark text-sm mb-4">{email}</p>
        <p className="text-slate-mid text-xs mb-6">
          Clique sur le lien pour choisir un nouveau mot de passe.
          Le lien est valable <span className="font-medium">1 heure</span>.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-primary font-medium hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-black text-slate-dark mb-2 tracking-tight">
        Mot de passe oublié
      </h1>
      <p className="text-slate-mid text-sm mb-8">
        Saisis ton email pour recevoir un lien de réinitialisation.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            "h-12 rounded-full font-semibold text-sm transition-all mt-2",
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100",
          ].join(" ")}
        >
          {loading ? "Envoi en cours…" : "Envoyer le lien"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-mid">
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
