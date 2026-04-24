"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface SavedState {
  savedIds: string[]
  toggle: (id: string) => void
}

const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      savedIds: [],
      toggle: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((x) => x !== id)
            : [...state.savedIds, id],
        })),
    }),
    {
      name: "kraak_saved_opportunities",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function useSavedOpportunities() {
  const { savedIds, toggle } = useSavedStore()

  function isSaved(id: string): boolean {
    return savedIds.includes(id)
  }

  return { savedIds, toggle, isSaved, count: savedIds.length }
}
