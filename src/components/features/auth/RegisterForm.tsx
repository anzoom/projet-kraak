"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ScoringOutput } from "@/types/scoring"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"
const STORAGE_KEY_RESULT = "kraak_scoring_result"

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromTest = searchParams.get("from") === "test"
  const nextPath = searchParams.get("next") ?? (fromTest ? "/results" : "/")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationPending, setConfirmationPending] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const emailRedirectTo = nextPath !== "/"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      : `${window.location.origin}/auth/callback`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    })

    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "Cet email est déjà utilisé. Connecte-toi à la place."
          : signUpError.message,
      )
      setLoading(false)
      return
    }

    // Session nulle = confirmation email requise
    if (!data.session) {
      setConfirmationPending(true)
      setLoading(false)
      return
    }

    // Session immédiate = confirmation désactivée
    if (fromTest) {
      await triggerScoring()
    }
    router.push(nextPath)
  }

  async function triggerScoring() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION)
      if (!raw) return
      const session = JSON.parse(raw) as { answers?: Record<string, string> }
      const answers = session.answers
      if (!answers || Object.keys(answers).length === 0) return

      const res = await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) return

      const score: ScoringOutput = await res.json()
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify({ answers, score }))
    } catch {
      // scoring non bloquant — on redirige quand même vers /results
    }
  }

  async function handleResend() {
    setResendLoading(true)
    const supabase = createSupabaseBrowserClient()
    const emailRedirectTo = nextPath !== "/"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      : `${window.location.origin}/auth/callback`
    await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo } })
    setResendSent(true)
    setResendLoading(false)
  }

  if (confirmationPending) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-5xl mb-4">📬</p>
        <h2 className="text-xl font-bold text-slate-dark mb-2">Vérifie ta boîte mail</h2>
        <p className="text-slate-mid text-sm mb-1">
          Un lien de confirmation a été envoyé à
        </p>
        <p className="font-semibold text-slate-dark text-sm mb-3">{email}</p>
        <p className="text-slate-mid text-xs mb-6">
          Clique sur le lien pour activer ton compte et accéder à tes résultats.
          Le lien est valable <span className="font-medium">24 heures</span>.
        </p>
        {resendSent ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            Lien renvoyé ! Vérifie ta boîte mail.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-primary font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resendLoading ? "Envoi en cours…" : "Renvoyer le lien"}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-black text-slate-dark mb-2 tracking-tight">
        Crée ton compte
      </h1>
      <p className="text-slate-mid text-sm mb-8">
        Pour accéder à tes résultats personnalisés
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 6 caractères"
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
          {loading ? "Inscription en cours…" : "S'inscrire"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-mid">
        J'ai déjà un compte —{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
