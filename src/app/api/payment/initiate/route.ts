import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { initiateCinetPayPayment } from "@/lib/cinetpay"
import { computeScore } from "@/domain/scoring/scorer"
import type { TestAnswers } from "@/types/test"

const AMOUNT = parseInt(process.env.PAYMENT_AMOUNT_XOF ?? "2500", 10)
const CURRENCY = "XOF"

export async function POST(request: NextRequest) {
  // user_id extrait du JWT — jamais depuis le body (protection IDOR)
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let answers: TestAnswers
  try {
    const body = await request.json() as { answers?: TestAnswers }
    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json({ error: "answers requis" }, { status: 400 })
    }
    answers = body.answers
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
  }

  // Upsert Prisma User (synchro Supabase Auth → Prisma)
  const prismaUser = await prisma.user.upsert({
    where: { supabase_uid: user.id },
    update: {},
    create: {
      email: user.email!,
      supabase_uid: user.id,
    },
  })

  // Score calculé côté serveur (source fiable, non falsifiable)
  const score = computeScore(answers)

  const testResponse = await prisma.testResponse.create({
    data: {
      user_id: prismaUser.id,
      answers,
      completed: true,
    },
  })

  const profileScore = await prisma.userProfileScore.create({
    data: {
      test_response_id: testResponse.id,
      academic_score: Math.round(score.academic_score),
      financial_score: Math.round(score.financial_score),
      maturity_score: Math.round(score.maturity_score),
      segment: score.segment,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      user_id: prismaUser.id,
      amount: AMOUNT,
      currency: CURRENCY,
      psp: "cinetpay",
    },
  })

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  try {
    const { payment_url } = await initiateCinetPayPayment({
      transactionId: payment.id,
      amount: AMOUNT,
      currency: CURRENCY,
      description: "KRAAK — Accès complet à tes recommandations",
      returnUrl: `${origin}/results?payment=success&score_id=${profileScore.id}`,
      notifyUrl: `${origin}/api/webhooks/cinetpay`,
    })

    return NextResponse.json({ payment_url })
  } catch (err) {
    await prisma.payment.delete({ where: { id: payment.id } }).catch(() => {})
    console.error("[payment/initiate] CinetPay error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 502 }
    )
  }
}
