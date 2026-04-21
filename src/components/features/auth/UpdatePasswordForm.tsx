"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function UpdatePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError("Une erreur est survenue. Le lien a peut-être expiré — demande un nouveau lien.")
      setLoading(false)
      return
    }

    router.push("/results")
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-black text-slate-dark mb-2 tracking-tight">
        Nouveau mot de passe
      </h1>
      <p className="text-slate-mid text-sm mb-8">
        Choisis un mot de passe sécurisé pour ton compte KRAAK.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-dark">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 8 caractères"
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-slate-dark text-base focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-medium text-slate-dark">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Répète ton mot de passe"
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
          {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
        </button>
      </form>
    </div>
  )
}
