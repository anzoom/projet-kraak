import { NextRequest, NextResponse } from "next/server"
import { computeScore } from "@/domain/scoring/scorer"
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
    !("answers" in body) ||
    typeof (body as Record<string, unknown>).answers !== "object" ||
    (body as Record<string, unknown>).answers === null
  ) {
    return NextResponse.json(
      { error: "Le champ 'answers' est requis et doit être un objet" },
      { status: 400 },
    )
  }

  const answers = (body as Record<string, unknown>).answers as TestAnswers
  const result = computeScore(answers)

  return NextResponse.json(result, { status: 200 })
}
