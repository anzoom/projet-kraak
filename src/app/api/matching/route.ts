import { NextRequest, NextResponse } from "next/server"
import { matchOpportunities } from "@/domain/matching/matcher"
import type { ScoringOutput, Opportunity } from "@/types/scoring"
import type { TestAnswers } from "@/types/test"

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("score" in body) ||
    typeof (body as Record<string, unknown>).score !== "object" ||
    (body as Record<string, unknown>).score === null
  ) {
    return NextResponse.json(
      { error: "Le champ 'score' est requis" },
      { status: 400 },
    )
  }

  if (
    !("answers" in body) ||
    typeof (body as Record<string, unknown>).answers !== "object" ||
    (body as Record<string, unknown>).answers === null
  ) {
    return NextResponse.json(
      { error: "Le champ 'answers' est requis" },
      { status: 400 },
    )
  }

  const b = body as Record<string, unknown>
  const score = b.score as ScoringOutput
  const answers = b.answers as TestAnswers
  const opportunities = Array.isArray(b.opportunities)
    ? (b.opportunities as Opportunity[])
    : []

  const recommendations = matchOpportunities({ score, answers, opportunities })

  return NextResponse.json(recommendations, { status: 200 })
}
