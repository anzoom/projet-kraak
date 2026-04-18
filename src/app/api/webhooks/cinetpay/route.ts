import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyCinetPaySignature } from "@/lib/cinetpay/verify-hmac"

interface CinetPayWebhookPayload {
  cpm_site_id: string
  cpm_trans_id: string
  cpm_trans_status: string
  cpm_amount: string
  cpm_currency: string
  signature: string
  [key: string]: string
}

export async function POST(request: NextRequest) {
  const secret = process.env.CINETPAY_WEBHOOK_SECRET
  if (!secret) {
    console.error("[webhook/cinetpay] CINETPAY_WEBHOOK_SECRET manquant")
    return NextResponse.json({ error: "Config serveur manquante" }, { status: 500 })
  }

  let payload: CinetPayWebhookPayload
  try {
    payload = await request.json() as CinetPayWebhookPayload
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
  }

  const { cpm_site_id, cpm_trans_id, cpm_trans_status, cpm_amount, cpm_currency, signature } = payload

  if (!cpm_trans_id || !signature) {
    return NextResponse.json({ error: "Payload incomplet" }, { status: 400 })
  }

  // Vérification HMAC
  const valid = verifyCinetPaySignature(
    { cpm_site_id, cpm_trans_id, cpm_trans_status, cpm_amount, cpm_currency },
    signature,
    secret
  )

  if (!valid) {
    console.warn("[webhook/cinetpay] Signature invalide pour trans_id:", cpm_trans_id)
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 })
  }

  // Idempotence : ignorer si déjà traité en SUCCESS
  const existing = await prisma.payment.findUnique({
    where: { psp_transaction_id: cpm_trans_id },
  })

  if (existing?.status === "SUCCESS") {
    return NextResponse.json({ received: true })
  }

  // Trouver le Payment PENDING par son id (= transactionId CinetPay)
  const payment = await prisma.payment.findUnique({
    where: { id: cpm_trans_id },
  })

  if (!payment) {
    console.warn("[webhook/cinetpay] Payment introuvable:", cpm_trans_id)
    return NextResponse.json({ error: "Payment introuvable" }, { status: 404 })
  }

  if (cpm_trans_status === "ACCEPTED") {
    // Transaction atomique : Payment(SUCCESS) + PurchaseAccess
    const scoreRecord = await prisma.userProfileScore.findFirst({
      where: {
        test_response: { user_id: payment.user_id },
      },
      orderBy: { computed_at: "desc" },
    })

    if (!scoreRecord) {
      console.error("[webhook/cinetpay] UserProfileScore introuvable pour user:", payment.user_id)
      return NextResponse.json({ error: "Score introuvable" }, { status: 500 })
    }

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          psp_transaction_id: cpm_trans_id,
        },
      }),
      prisma.purchaseAccess.create({
        data: {
          user_id: payment.user_id,
          payment_id: payment.id,
          score_id: scoreRecord.id,
          expires_at: expiresAt,
        },
      }),
    ])
  } else {
    // FAILED ou CANCELLED
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        psp_transaction_id: cpm_trans_id,
      },
    })
  }

  return NextResponse.json({ received: true })
}
