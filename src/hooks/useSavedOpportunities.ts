"use client"

import { useState, useEffect, useCallback } from "react"

const MAX_SAVED = 15

interface UseSavedOptions {
  isPremium: boolean
  isAuthenticated: boolean
}

export function useSavedOpportunities({ isPremium, isAuthenticated }: UseSavedOptions) {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [limitReached, setLimitReached] = useState(false)

  const enabled = isPremium && isAuthenticated

  useEffect(() => {
    if (!enabled) { setSavedIds([]); return }
    fetch("/api/user/saved")
      .then((r) => r.json())
      .then((data: { savedIds?: string[] }) => setSavedIds(data.savedIds ?? []))
      .catch(() => {})
  }, [enabled])

  const toggle = useCallback(async (opportunityId: string) => {
    if (!enabled) return
    setLimitReached(false)

    try {
      const res = await fetch("/api/user/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      })
      const data = (await res.json()) as { savedIds?: string[]; limitReached?: boolean; error?: string }

      if (data.limitReached) { setLimitReached(true); return }
      if (data.savedIds) { setSavedIds(data.savedIds); return }
      if (data.error) console.error("[useSavedOpportunities] API error:", data.error)
    } catch (err) {
      console.error("[useSavedOpportunities] fetch error:", err)
    }
  }, [enabled])

  function isSaved(id: string) { return savedIds.includes(id) }

  return {
    savedIds,
    toggle,
    isSaved,
    count: savedIds.length,
    limitReached,
    maxSaved: MAX_SAVED,
  }
}
