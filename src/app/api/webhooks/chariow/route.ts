import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { createHmac } from "crypto"
import type { GuidePlan } from "@prisma/client"

// Stub Phase 3 — activer quand Chariow fournit les webhooks
// Signature HMAC à valider selon la doc Chariow

function verifyHmac(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex")
  return expected === signature
}

interface ChariowWebhookPayload {
  event: string
  order_id: string
  customer_email: string
  product_id: string
  status: string
  metadata?: Record<string, string>
}

const PRODUCT_PLAN_MAP: Record<string, GuidePlan> = {
  [process.env.CHARIOW_PRODUCT_GUIDE_MONTHLY_ID ?? "guide_monthly"]: "MONTHLY",
  [process.env.CHARIOW_PRODUCT_GUIDE_ANNUAL_ID ?? "guide_annual"]: "ANNUAL",
}

export async function POST(request: NextRequest) {
  const secret = process.env.CHARIOW_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get("x-chariow-signature") ?? ""

  if (!verifyHmac(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 })
  }

  let payload: ChariowWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 })
  }

  if (payload.event !== "order.completed" || payload.status !== "paid") {
    return NextResponse.json({ received: true })
  }

  const plan = PRODUCT_PLAN_MAP[payload.product_id]
  if (!plan) {
    return NextResponse.json({ received: true })
  }

  const user = await prisma.user.findUnique({ where: { email: payload.customer_email } })
  if (!user) {
    // Utilisateur non enregistré sur KRAAK — ignorer ou créer
    return NextResponse.json({ received: true })
  }

  // Idempotence : vérifier si cet order_id a déjà été traité
  const existing = await prisma.checkoutSession.findFirst({
    where: { user_id: user.id, status: "COMPLETED" },
  })

  if (!existing) {
    await prisma.$transaction([
      prisma.guideSubscription.create({
        data: {
          user_id: user.id,
          plan,
          status: "ACTIVE",
          current_period_end: plan === "ANNUAL"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lemon_order_id: payload.order_id,
        },
      }),
    ])

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "KRAAK <bonjour@kraak.co>",
        to: user.email,
        subject: "Bienvenue dans KRAAK Premium Guide 🎉",
        html: `<p>Ton accès Premium Guide est activé. <a href="${process.env.NEXT_PUBLIC_APP_URL}/guide">Accéder au guide →</a></p>`,
      })
    } catch {
      // Non bloquant
    }
  }

  return NextResponse.json({ received: true })
}
