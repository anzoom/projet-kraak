import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { TestAnswers } from "@/types/test"
import { STORAGE_KEY } from "@/types/test"

interface TestState {
  answers: TestAnswers
  currentStep: number
}

interface TestActions {
  setAnswer: (questionId: string, value: string) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
}

const initialState: TestState = {
  answers: {},
  currentStep: 0,
}

function safeLocalStorage() {
  try {
    return createJSONStorage(() => localStorage)
  } catch {
    return createJSONStorage(() => sessionStorage)
  }
}

export const useTestStore = create<TestState & TestActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      nextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      goToStep: (step) => set({ currentStep: step }),

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      storage: safeLocalStorage(),
      partialize: (state) => ({
        answers: state.answers,
        currentStep: state.currentStep,
      }),
    }
  )
)
