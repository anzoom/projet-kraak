import { NextResponse } from "next/server"
import { COUNTRY_GROUPS } from "@/lib/countries"

// Returns grouped country structure for the selector.
// "international" is excluded: worldwide opportunities are included automatically
// via the "peu_importe" option (see matcher.ts).
export async function GET() {
  const groups = COUNTRY_GROUPS

  // Extra zones with no specific countries listed yet
  const otherZones = [
    { value: "amerique_sud", label: "Amérique du Sud" },
    { value: "moyen_orient", label: "Moyen-Orient" },
    { value: "oceanie",      label: "Océanie" },
  ]

  return NextResponse.json(
    { groups, otherZones },
    { headers: { "Cache-Control": "public, max-age=300" } },
  )
}
