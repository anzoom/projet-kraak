import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import type { GuidePlan } from "@prisma/client"

// URLs fixes configurées dans le dashboard Chariow
// La redirection post-paiement (vers /guide/success) est définie côté Chariow, pas en paramètre URL
const CHARIOW_URLS: Record<GuidePlan, string> = {
  MONTHLY: process.env.NEXT_PUBLIC_CHARIOW_GUIDE_MONTHLY_URL ?? "",
  ANNUAL: process.env.NEXT_PUBLIC_CHARIOW_GUIDE_ANNUAL_URL ?? "",
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
  }

  const plan = (body as Record<string, unknown>)?.plan as GuidePlan | undefined
  if (plan !== "MONTHLY" && plan !== "ANNUAL") {
    return NextResponse.json({ error: "plan invalide (MONTHLY | ANNUAL)" }, { status: 400 })
  }

  const chariowUrl = CHARIOW_URLS[plan]
  if (!chariowUrl) {
    return NextResponse.json({ error: "URL Chariow non configurée" }, { status: 500 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Expirer les sessions précédentes en attente
  await prisma.checkoutSession.updateMany({
    where: { user_id: dbUser.id, status: "PENDING" },
    data: { status: "EXPIRED" },
  })

  // Créer une nouvelle session — sera activée au retour sur /guide/success via la session Supabase
  await prisma.checkoutSession.create({
    data: {
      user_id: dbUser.id,
      plan,
      expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1h
    },
  })

  return NextResponse.json({ redirect_url: chariowUrl })
}
