"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

interface CountryOption {
  value: string
  label: string
}

const FALLBACK: CountryOption[] = [
  { value: "afrique", label: "Afrique (hors mon pays)" },
  { value: "canada", label: "Canada" },
  { value: "europe", label: "Europe (Allemagne, Belgique, Pays-Bas…)" },
  { value: "france", label: "France" },
  { value: "usa", label: "États-Unis" },
  { value: "peu_importe", label: "Peu importe, je suis ouvert(e)" },
]

interface Props {
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

export default function CountrySelectCard({ selectedValue, onSelect }: Props) {
  const [options, setOptions] = useState<CountryOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((data: { countries: CountryOption[] }) => setOptions(data.countries))
      .catch(() => setOptions(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-dark mb-6 leading-snug">
        Dans quel pays ou région tu voudrais aller ?
      </h2>

      <div className="relative">
        <select
          value={selectedValue ?? ""}
          onChange={(e) => {
            if (e.target.value) onSelect(e.target.value)
          }}
          disabled={loading}
          className={[
            "w-full appearance-none h-[52px] px-5 pr-10 rounded-xl border-2 font-medium text-base transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            loading
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-wait"
              : selectedValue
              ? "border-primary bg-primary-light text-primary"
              : "border-gray-200 bg-white text-slate-dark hover:border-primary/40",
          ].join(" ")}
        >
          <option value="" disabled>
            {loading ? "Chargement…" : "Sélectionne un pays ou une région"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className={[
            "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors",
            selectedValue ? "text-primary" : "text-slate-mid",
          ].join(" ")}
        />
      </div>
    </div>
  )
}
