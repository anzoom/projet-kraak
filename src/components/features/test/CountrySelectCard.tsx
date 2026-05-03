"use client"

import { ChevronDown } from "lucide-react"
import { COUNTRY_GROUPS } from "@/lib/countries"

interface Props {
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

export default function CountrySelectCard({ selectedValue, onSelect }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-dark mb-2 leading-snug">
        Dans quel pays ou quelle zone veux-tu évoluer ?
      </h2>
      <p className="text-sm text-slate-mid mb-6">
        Choisis un pays pour un matching précis, ou une zone si tu es ouvert(e) à plusieurs destinations.
      </p>

      <div className="relative">
        <select
          value={selectedValue ?? ""}
          onChange={(e) => {
            if (e.target.value) onSelect(e.target.value)
          }}
          className={[
            "w-full appearance-none h-[52px] px-5 pr-10 rounded-xl border-2 font-medium text-base transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            selectedValue
              ? "border-primary bg-primary-light text-primary"
              : "border-gray-200 bg-white text-slate-dark hover:border-primary/40",
          ].join(" ")}
        >
          <option value="" disabled>
            Sélectionne un pays ou une zone
          </option>

          {COUNTRY_GROUPS.map((group) => (
            <optgroup key={group.zoneValue} label={`── ${group.zoneLabel}`}>
              {group.countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
              <option value={group.zoneValue}>
                {group.zoneLabel} — toute la zone
              </option>
            </optgroup>
          ))}

          <optgroup label="── Autres zones">
            <option value="amerique_sud">Amérique du Sud</option>
            <option value="moyen_orient">Moyen-Orient</option>
            <option value="oceanie">Océanie</option>
          </optgroup>

          <option value="peu_importe">Toutes destinations — je suis ouvert(e)</option>
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
