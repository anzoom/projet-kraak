"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

function isSafeRedirect(next: string | null): boolean {
  if (!next) return false
  try {
    // Reject absolute URLs (open redirect protection)
    new URL(next)
    return false
  } catch {
    return next.startsWith("/")
  }
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      const msg = signInError.message.toLowerCase()
      setError(
        msg.includes("not confirmed") || msg.includes("email not confirmed")
          ? "Confirme ton email avant de te connecter (vérifie ta boîte mail)."
          : "Email ou mot de passe incorrect.",
      )
      setLoading(false)
      return
    }

    router.push(isSafeRedirect(next) ? next! : "/results")
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-black text-slate-dark mb-2 tracking-tight">
        Connexion
      </h1>
      <p className="text-slate-mid text-sm mb-8">
        Accède à tes résultats et recommandations
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-dark">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ton mot de passe"
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
          {loading ? "Connexion en cours…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-mid">
        Pas encore de compte —{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
