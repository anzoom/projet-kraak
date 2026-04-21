import { NextResponse } from "next/server"
import { fetchOpportunities } from "@/lib/opportunities"

const COUNTRY_LABELS: Record<string, string> = {
  afrique: "Afrique (hors mon pays)",
  canada: "Canada",
  europe: "Europe (Allemagne, Belgique, Pays-Bas…)",
  france: "France",
  usa: "États-Unis",
}

export async function GET() {
  const opportunities = await fetchOpportunities()

  const seen = new Set<string>()
  const countries: { value: string; label: string }[] = []

  for (const opp of opportunities) {
    if (!seen.has(opp.country) && COUNTRY_LABELS[opp.country]) {
      seen.add(opp.country)
      countries.push({ value: opp.country, label: COUNTRY_LABELS[opp.country] })
    }
  }

  countries.sort((a, b) => a.label.localeCompare(b.label, "fr"))
  countries.push({ value: "peu_importe", label: "Peu importe, je suis ouvert(e)" })

  return NextResponse.json({ countries }, { headers: { "Cache-Control": "public, max-age=300" } })
}
