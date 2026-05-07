"use client"

import { Bookmark, Lock } from "lucide-react"

interface Props {
  saved: boolean
  onToggle: () => void
  isPremium: boolean
  disabled?: boolean
}

export default function SaveButton({ saved, onToggle, isPremium, disabled }: Props) {
  if (!isPremium) {
    return (
      <div
        title="Disponible avec le Guide Premium"
        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 bg-gray-50 cursor-default"
      >
        <Lock className="w-3.5 h-3.5" />
      </div>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onToggle()
      }}
      disabled={disabled}
      aria-label={saved ? "Retirer des favoris" : "Sauvegarder cette opportunité"}
      className={[
        "w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40",
        saved
          ? "text-primary bg-orange-50 hover:bg-orange-100"
          : "text-slate-mid bg-gray-100 hover:bg-gray-200",
      ].join(" ")}
    >
      <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
    </button>
  )
}
