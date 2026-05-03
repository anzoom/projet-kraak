"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X, ChevronDown, UserCircle, LogOut, BookOpen, Users } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface Props {
  isLoggedIn: boolean
}

export default function NavbarAuthButtons({ isLoggedIn }: Props) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (open) emailRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  function openModal() {
    setEmail("")
    setPassword("")
    setError(null)
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        const msg = signInError.message.toLowerCase()
        setError(
          msg.includes("not confirmed") || msg.includes("email not confirmed")
            ? "Confirme ton email avant de te connecter (vérifie ta boîte mail)."
            : "Email ou mot de passe incorrect.",
        )
        return
      }

      window.location.href = "/results"
    } catch {
      setError("Une erreur est survenue. Réessaie dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/guide"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Guide
        </Link>
        <Link
          href="/coaching"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
        >
          <Users className="w-4 h-4" />
          Coaching
        </Link>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
          >
            Mon profil
            <ChevronDown className={["w-4 h-4 transition-transform", menuOpen ? "rotate-180" : ""].join(" ")} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-light transition-colors"
              >
                <UserCircle className="w-4 h-4 text-slate-mid" />
                Mon profil
              </Link>
              <Link
                href="/guide"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-light transition-colors sm:hidden"
              >
                <BookOpen className="w-4 h-4 text-slate-mid" />
                Guide Premium
              </Link>
              <Link
                href="/coaching"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-light transition-colors sm:hidden"
              >
                <Users className="w-4 h-4 text-slate-mid" />
                Coaching
              </Link>
              <div className="mx-3 my-1 border-t border-gray-100" />
              <a
                href="/auth/logout"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </a>
            </div>
          )}
        </div>
        <Link
          href="/results"
          className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors min-w-[44px]"
        >
          Mes résultats
        </Link>
      </div>
    )
  }

  const modal = mounted && open ? createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Connexion"
    >
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-7">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-slate-mid hover:text-slate-dark transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-slate-dark mb-1 tracking-tight">
          Connexion
        </h2>
        <p className="text-sm text-slate-mid mb-6">
          Accède à tes résultats et recommandations.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-email" className="text-sm font-medium text-slate-dark">
              Email
            </label>
            <input
              ref={emailRef}
              id="modal-email"
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
            <label htmlFor="modal-password" className="text-sm font-medium text-slate-dark">
              Mot de passe
            </label>
            <input
              id="modal-password"
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

          <div className="flex justify-end -mt-1">
            <Link
              href="/auth/forgot-password"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-mid hover:text-primary transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

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
            {loading ? "Connexion en cours…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-mid">
          Pas encore de compte —{" "}
          <Link
            href="/auth/register"
            onClick={() => setOpen(false)}
            className="text-primary font-medium hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href="/guide"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Guide
        </Link>
        <button
          onClick={openModal}
          className="text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
        >
          Se connecter
        </button>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors min-w-[44px]"
        >
          S'inscrire
        </Link>
      </div>
      {modal}
    </>
  )
}
