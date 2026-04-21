"use client"

import { Bookmark } from "lucide-react"
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities"

interface Props {
  opportunityId: string
}

export default function SaveButton({ opportunityId }: Props) {
  const { toggle, isSaved } = useSavedOpportunities()
  const saved = isSaved(opportunityId)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggle(opportunityId)
      }}
      aria-label={saved ? "Retirer des favoris" : "Sauvegarder cette opportunité"}
      className={[
        "w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90",
        saved
          ? "text-primary bg-orange-50 hover:bg-orange-100"
          : "text-slate-mid bg-gray-100 hover:bg-gray-200",
      ].join(" ")}
    >
      <Bookmark
        className="w-4 h-4"
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  )
}
