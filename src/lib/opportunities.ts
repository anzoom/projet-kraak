import type { Opportunity } from "@/types/scoring"
import { normalizeStudyLevel } from "@/types/scoring"
import { seedOpportunities } from "@/data/seed-opportunities"

interface PayloadDoc {
  id: string
  title: string
  is_active: boolean
  study_level: string
  category: string
  domain: string
  country: string
  funding_type: string
  deadline?: string | null
  budget_required?: number | null
  short_description?: string | null
  source_url?: string | null
  eligibility_summary?: string | null
}

interface PayloadResponse {
  docs: PayloadDoc[]
}

export async function fetchOpportunities(): Promise<Opportunity[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const res = await fetch(
      `${baseUrl}/api/opportunities?where[is_active][equals]=true&limit=50`,
      { next: { revalidate: 300 } },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: PayloadResponse = await res.json()
    const opportunities: Opportunity[] = data.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title,
      is_active: doc.is_active,
      study_level: normalizeStudyLevel(doc.study_level),
      category: doc.category,
      domain: doc.domain,
      country: doc.country,
      funding_type: doc.funding_type,
      deadline: doc.deadline ?? null,
      budget_required: doc.budget_required ?? null,
      short_description: doc.short_description ?? null,
      source_url: doc.source_url ?? null,
      eligibility_summary: doc.eligibility_summary ?? null,
    }))
    // Seuil minimum : le catalogue Payload doit être suffisamment garni
    // pour couvrir tous les profils. Sous ce seuil, on utilise le seed.
    if (opportunities.length >= 10) return opportunities
  } catch {
    // fall through to seed
  }
  return seedOpportunities
}
