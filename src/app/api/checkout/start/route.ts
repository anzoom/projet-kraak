import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { CHARIOW_URLS } from "@/lib/chariow"
import type { GuidePlan } from "@prisma/client"

const PLAN_URLS: Record<GuidePlan, string> = {
  MONTHLY: CHARIOW_URLS.guide.monthly,
  ANNUAL: CHARIOW_URLS.guide.annual,
}

export async function GET(request: NextRequest) {
  try {
    const plan = request.nextUrl.searchParams.get("plan")?.toUpperCase() as GuidePlan | null

    if (plan !== "MONTHLY" && plan !== "ANNUAL") {
      return NextResponse.redirect(new URL("/guide-premium?error=invalid_plan", request.url))
    }

    const chariowUrl = PLAN_URLS[plan]
    if (!chariowUrl) {
      return NextResponse.redirect(new URL("/guide-premium?error=not_configured", request.url))
    }

    const supabase = await createSupabaseServerAnonClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Non authentifié → login avec retour sur la page de démarrage
    if (!user) {
      const returnUrl = `/api/checkout/start?plan=${plan}`
      return NextResponse.redirect(
        new URL(`/auth/login?next=${encodeURIComponent(returnUrl)}`, request.url),
      )
    }

    const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
    if (!dbUser) {
      return NextResponse.redirect(new URL("/guide-premium?error=user_not_found", request.url))
    }

    // Expirer les sessions précédentes en attente
    await prisma.checkoutSession.updateMany({
      where: { user_id: dbUser.id, status: "PENDING" },
      data: { status: "EXPIRED" },
    })

    // Créer la session de paiement
    await prisma.checkoutSession.create({
      data: {
        user_id: dbUser.id,
        plan,
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    return NextResponse.redirect(chariowUrl)
  } catch (err) {
    console.error("[checkout/start] error:", err)
    return NextResponse.redirect(new URL("/guide-premium?error=server_error", request.url))
  }
}
