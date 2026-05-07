"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { UserCircle, ChevronDown, LogOut, BookOpen } from "lucide-react"

export default function ResultsHeaderMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
      >
        <UserCircle className="w-5 h-5" />
        Mon profil
        <ChevronDown className={["w-4 h-4 transition-transform", open ? "rotate-180" : ""].join(" ")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-light transition-colors"
          >
            <UserCircle className="w-4 h-4 text-slate-mid" />
            Mon profil
          </Link>
          <Link
            href="/guide-premium"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-light transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-mid" />
            Guide — bientôt
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
  )
}
