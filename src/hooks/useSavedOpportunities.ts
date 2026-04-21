"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "kraak_saved_opportunities"

export function useSavedOpportunities() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSavedIds(JSON.parse(raw) as string[])
    } catch {
      // ignore malformed data
    }
  }, [])

  const toggle = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  const isSaved = useCallback(
    (id: string) => isMounted && savedIds.includes(id),
    [isMounted, savedIds],
  )

  return { savedIds, toggle, isSaved, count: isMounted ? savedIds.length : 0 }
}
