"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import posthog from "posthog-js"

const SERVICES = [
  { value: "guide", label: "📚 Guide KRAAK" },
  { value: "coaching", label: "👤 Coaching" },
  { value: "visa", label: "🛂 Aide visa" },
  { value: "voyage", label: "✈️ Voyage" },
]

interface Props {
  source?: string
  ctaLabel?: string
  title?: string
  subtitle?: string
  compact?: boolean
}

export default function BetaCapture({
  source = "beta_capture",
  ctaLabel = "Me prévenir →",
  title = "Services à venir",
  subtitle = "Dis-nous ce qui t'intéresse — on te prévient en premier.",
  compact = true,
}: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  function toggle(v: string) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || status === "loading") return
    setStatus("loading")
    try {
      await fetch("/api/guide-premium/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source, interest: selected.join(", ") }),
      })
      posthog.capture("waitlist_signup", { source, interests: selected })
      setStatus("done")
    } catch {
      setStatus("idle")
    }
  }

  if (status === "done") {
    return (
      <div className={[
        "bg-white border-2 border-green-100 rounded-2xl p-5 flex items-center gap-3",
        compact ? "" : "shadow-sm",
      ].join(" ")}>
        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
        <div>
          <p className="font-bold text-slate-dark text-sm">C&apos;est noté !</p>
          <p className="text-xs text-slate-mid">On te prévient en avant-première à l&apos;ouverture.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={[
      "bg-white border-2 border-orange-100 rounded-2xl p-5 space-y-4",
      compact ? "" : "shadow-sm",
    ].join(" ")}>
      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">{title}</p>
        <p className="font-black text-slate-dark text-sm leading-snug">{subtitle}</p>
      </div>

      <div className="flex gap-1.5">
        {SERVICES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => toggle(s.value)}
            className={[
              "flex-1 min-w-0 flex items-center justify-center py-2 rounded-full text-[10px] font-bold border-2 transition-colors leading-tight text-center",
              selected.includes(s.value)
                ? "bg-primary border-primary text-white"
                : "bg-orange-50 border-orange-100 text-primary hover:border-primary/50",
            ].join(" ")}
          >
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 text-sm text-slate-dark placeholder:text-slate-mid/50 focus:outline-none focus:border-primary disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-sm shadow-orange-100"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            ctaLabel
          )}
        </button>
      </form>

      <p className="text-xs text-slate-mid text-center">Gratuit · Pas de spam · Désinscription à tout moment</p>
    </div>
  )
}
