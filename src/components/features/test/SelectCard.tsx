"use client"

import { ChevronDown } from "lucide-react"
import type { Question } from "@/types/test"

interface Props {
  question: Question
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

export default function SelectCard({ question, selectedValue, onSelect }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-dark mb-6 leading-snug">
        {question.text}
      </h2>

      <div className="relative">
        <select
          value={selectedValue ?? ""}
          onChange={(e) => { if (e.target.value) onSelect(e.target.value) }}
          className={[
            "w-full appearance-none h-[52px] px-5 pr-10 rounded-xl border-2 font-medium text-base transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            selectedValue
              ? "border-primary bg-primary-light text-primary"
              : "border-gray-200 bg-white text-slate-dark hover:border-primary/40",
          ].join(" ")}
        >
          <option value="" disabled>Sélectionne une option</option>
          {question.options.map((opt) => (
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
