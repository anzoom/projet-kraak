"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTestStore } from "@/store/testStore"
import { questions } from "@/data/questions"
import ProgressBar from "./ProgressBar"
import QuestionCard from "./QuestionCard"

const TOTAL = questions.length

export default function TestStepper() {
  const router = useRouter()
  const { answers, currentStep, setAnswer, nextStep, prevStep } = useTestStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-mid text-sm">Chargement…</p>
      </div>
    )
  }

  const question = questions[currentStep]
  const selectedValue = answers[question.id]
  const isFirst = currentStep === 0
  const isLast = currentStep === TOTAL - 1
  const canAdvance = selectedValue !== undefined

  function handleSelect(value: string) {
    setAnswer(question.id, value)
  }

  function handleNext() {
    if (!canAdvance) return
    if (isLast) {
      router.push("/auth/register?from=test")
      return
    }
    nextStep()
  }

  function handlePrev() {
    if (!isFirst) prevStep()
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 sm:py-12">
      <ProgressBar current={currentStep + 1} total={TOTAL} />

      <div className="mt-8 mb-8">
        <QuestionCard
          question={question}
          selectedValue={selectedValue}
          onSelect={handleSelect}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {!isFirst ? (
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full border-2 border-gray-200 text-slate-mid font-medium text-sm hover:border-primary/40 hover:text-primary transition-colors min-w-[44px]"
            aria-label="Question précédente"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className={[
            "inline-flex items-center gap-2 h-12 px-6 rounded-full font-semibold text-sm transition-all min-w-[44px]",
            canAdvance
              ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-orange-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          ].join(" ")}
          aria-label={isLast ? "Voir mes résultats" : "Question suivante"}
        >
          {isLast ? "Voir mes résultats" : "Suivant"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {currentStep > 0 && (
        <p className="mt-4 text-center text-xs text-slate-mid">
          {Object.keys(answers).length} / {TOTAL} réponses enregistrées
        </p>
      )}
    </div>
  )
}
