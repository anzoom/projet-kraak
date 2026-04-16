import type { Question } from "@/types/test"

interface QuestionCardProps {
  question: Question
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-dark mb-6 leading-snug">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <button
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.value)}
              className={[
                "w-full min-h-[52px] px-5 py-3.5 rounded-xl border-2 text-left font-medium text-base transition-all",
                "flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary-light text-primary"
                  : "border-gray-200 bg-white text-slate-dark hover:border-primary/40 hover:bg-primary-light/40",
              ].join(" ")}
            >
              <span
                className={[
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-gray-300 bg-white",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
