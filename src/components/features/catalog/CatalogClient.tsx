"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import type { Opportunity } from "@/types/scoring"
import CatalogCard from "./CatalogCard"

const CATEGORY_OPTIONS = [
  { value: "tous", label: "Toutes catégories" },
  { value: "bourse", label: "Bourse" },
  { value: "programme", label: "Programme" },
  { value: "fellowship", label: "Fellowship" },
  { value: "concours", label: "Concours" },
  { value: "prix", label: "Prix" },
]

const ZONE_OPTIONS = [
  { value: "tous", label: "Toutes zones" },
  { value: "afrique", label: "Afrique" },
  { value: "europe", label: "Europe" },
  { value: "amerique_nord", label: "Amérique du Nord" },
  { value: "asie", label: "Asie" },
  { value: "amerique_sud", label: "Amérique du Sud" },
  { value: "moyen_orient", label: "Moyen-Orient" },
  { value: "oceanie", label: "Océanie" },
  { value: "international", label: "International" },
]

const FUNDING_OPTIONS = [
  { value: "tous", label: "Tout financement" },
  { value: "complete", label: "Financement complet" },
  { value: "partial", label: "Financement partiel" },
  { value: "non_financee", label: "Sans financement" },
  { value: "salariee", label: "Rémunéré" },
]

const DEADLINE_OPTIONS = [
  { value: "all", label: "Toutes dates" },
  { value: "soon", label: "⏰ Dans 30 jours" },
  { value: "no_deadline", label: "Programme permanent" },
]

function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

function isDeadlineSoon(deadline: string): boolean {
  const now = Date.now()
  const d = new Date(deadline).getTime()
  return d > now && d <= now + 30 * 24 * 60 * 60 * 1000
}

function FilterPill({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            "shrink-0 h-8 px-3 rounded-full text-xs font-semibold border-2 whitespace-nowrap transition-colors",
            value === opt.value
              ? "bg-primary text-white border-primary"
              : "bg-white text-slate-mid border-gray-200 hover:border-primary/40",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface Props {
  opportunities: Opportunity[]
  totalCount?: number
}

export default function CatalogClient({ opportunities, totalCount }: Props) {
  const [filterCategory, setFilterCategory] = useState("tous")
  const [filterZone, setFilterZone] = useState("tous")
  const [filterFunding, setFilterFunding] = useState("tous")
  const [filterDeadline, setFilterDeadline] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (filterCategory !== "tous" && opp.category !== filterCategory) return false
      if (filterZone !== "tous" && opp.country !== filterZone) return false
      if (filterFunding !== "tous" && opp.funding_type !== filterFunding) return false
      if (filterDeadline === "soon") {
        if (!opp.deadline || !isDeadlineSoon(opp.deadline)) return false
      }
      if (filterDeadline === "no_deadline") {
        if (opp.deadline !== null) return false
      }
      if (searchQuery.trim()) {
        if (!opp.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false
      }
      return true
    })
  }, [opportunities, filterCategory, filterZone, filterFunding, filterDeadline, searchQuery])

  const activeCount = filtered.filter((o) => !o.deadline || !isDeadlinePassed(o.deadline)).length
  const expiredCount = filtered.length - activeCount

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-mid" />
        <input
          type="text"
          placeholder="Rechercher une opportunité…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-9 pr-4 rounded-xl border-2 border-gray-200 text-sm text-slate-dark placeholder:text-slate-mid focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filtres */}
      <div className="space-y-2">
        <FilterPill options={CATEGORY_OPTIONS} value={filterCategory} onChange={setFilterCategory} />
        <FilterPill options={ZONE_OPTIONS} value={filterZone} onChange={setFilterZone} />
        <FilterPill options={FUNDING_OPTIONS} value={filterFunding} onChange={setFilterFunding} />
        <FilterPill options={DEADLINE_OPTIONS} value={filterDeadline} onChange={setFilterDeadline} />
      </div>

      {/* Compteur */}
      <p className="text-xs text-slate-mid font-semibold">
        {filtered.length} opportunité{filtered.length !== 1 ? "s" : ""}
        {expiredCount > 0 && <span className="font-normal"> ({expiredCount} édition{expiredCount > 1 ? "s" : ""} passée{expiredCount > 1 ? "s" : ""})</span>}
        {totalCount && totalCount > opportunities.length && (
          <span className="font-normal text-slate-mid"> · sélection de {opportunities.length} sur {totalCount}</span>
        )}
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-dark font-semibold mb-1">Aucune opportunité trouvée</p>
          <p className="text-sm text-slate-mid">Essaie d'élargir tes filtres ou de modifier ta recherche.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((opp) => (
            <CatalogCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  )
}
