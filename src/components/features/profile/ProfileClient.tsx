"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, LogOut, RefreshCw, Lock, ArrowLeft } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { questions } from "@/data/questions"

const STORAGE_KEY_SESSION = "kraak_anonymous_session"

interface Props {
  email: string
}

export default function ProfileClient({ email }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string> | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [savingAlerts, setSavingAlerts] = useState(false)
  const [guideAccess, setGuideAccess] = useState<{ hasAccess: boolean; plan?: string; expiresAt?: string } | null>(null)
  const [savedCount, setSavedCount] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION)
      if (raw) {
        const session = JSON.parse(raw) as {
          state?: { answers?: Record<string, string> }
          answers?: Record<string, string>
        }
        const parsed = session.state?.answers ?? session.answers ?? null
        if (parsed && Object.keys(parsed).length > 0) {
          setAnswers(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetch("/api/user/alerts")
      .then((r) => r.json())
      .then((data: { alerts_enabled?: boolean }) => {
        if (typeof data.alerts_enabled === "boolean") {
          setAlertsEnabled(data.alerts_enabled)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/user/guide-access")
      .then((r) => r.json())
      .then((data: { hasAccess: boolean; plan?: string; expiresAt?: string }) => {
        setGuideAccess(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/user/saved")
      .then((r) => r.json())
      .then((data: { savedIds?: string[]; premium?: boolean }) => {
        if (data.premium) setSavedCount(data.savedIds?.length ?? 0)
      })
      .catch(() => {})
  }, [])

  async function handleToggleAlerts() {
    const newValue = !alertsEnabled
    setSavingAlerts(true)
    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newValue }),
      })
      if (res.ok) {
        const data = (await res.json()) as { alerts_enabled: boolean }
        setAlertsEnabled(data.alerts_enabled)
      }
    } catch {
      // ignore
    } finally {
      setSavingAlerts(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  function getAnswerLabel(questionId: string, value: string): string {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return value
    const option = question.options.find((o) => o.value === value)
    return option?.label ?? value
  }

  return (
    <div className="bg-slate-light">
      <main className="max-w-lg mx-auto px-4 py-8 space-y-5">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Mes résultats
        </Link>

        {/* Compte */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider">Mon compte</h2>
          <p className="text-sm font-semibold text-slate-dark break-all">{email}</p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-dark">Alertes email</p>
              {guideAccess?.hasAccess ? (
                <p className="text-xs text-slate-mid">
                  Alertes sur tes opportunités sauvegardées
                  {savedCount !== null && (
                    <span className="ml-1 font-semibold text-primary">({savedCount}/15)</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-slate-mid">
                  Disponible avec le{" "}
                  <Link href="/guide-premium" className="text-primary font-semibold hover:underline">
                    Guide Premium
                  </Link>
                </p>
              )}
            </div>
            <button
              onClick={handleToggleAlerts}
              disabled={savingAlerts || !guideAccess?.hasAccess}
              aria-label="Toggle alertes email"
              title={!guideAccess?.hasAccess ? "Guide Premium requis" : undefined}
              className={[
                "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50",
                alertsEnabled && guideAccess?.hasAccess ? "bg-primary" : "bg-gray-200",
              ].join(" ")}
            >
              <span
                className={[
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform",
                  alertsEnabled && guideAccess?.hasAccess ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {/* Guide Premium */}
        {guideAccess !== null && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
            <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-3">Guide Premium</h2>
            {guideAccess.hasAccess ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center h-5 px-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Actif</span>
                  <span className="text-xs text-slate-mid">
                    {guideAccess.plan === "ANNUAL" ? "Plan annuel" : "Plan mensuel"}
                  </span>
                </div>
                {guideAccess.expiresAt && (
                  <p className="text-xs text-slate-mid">
                    Accès jusqu'au{" "}
                    {new Date(guideAccess.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  Lire le guide →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-mid">Aucun abonnement actif.</p>
                <Link
                  href="/guide-premium"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  Découvrir le Guide Premium →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Réponses du test */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
          <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-3">Mon profil de test</h2>
          {!isMounted || !answers ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-mid mb-4">
                Tu n'as pas encore complété le test de profil.
              </p>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                Faire le test
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {questions
                .filter((q) => answers[q.id] !== undefined)
                .map((q) => (
                  <li key={q.id} className="flex items-start justify-between gap-3">
                    <span className="text-xs text-slate-mid leading-snug">{q.text}</span>
                    <span className="text-xs font-semibold text-slate-dark text-right shrink-0 max-w-[45%]">
                      {getAnswerLabel(q.id, answers[q.id])}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-mid uppercase tracking-wider mb-1">Actions</h2>
          <Link
            href="/results"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            Voir mes résultats
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/test"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary-light transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refaire le test
          </Link>
          <Link
            href="/auth/update-password"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-full border-2 border-gray-200 text-slate-mid font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Changer mon mot de passe
          </Link>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-full text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </main>
    </div>
  )
}
