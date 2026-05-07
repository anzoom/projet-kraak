import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const MAX_SAVED = 15

async function getDbUser(supabaseUid: string, email: string) {
  return prisma.user.upsert({
    where: { supabase_uid: supabaseUid },
    update: {},
    create: { supabase_uid: supabaseUid, email },
  })
}

async function isPremium(userId: string): Promise<boolean> {
  const sub = await prisma.guideSubscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ["ACTIVE", "CANCELLED"] },
      current_period_end: { gt: new Date() },
    },
    select: { id: true },
  })
  return !!sub
}

export async function GET() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const dbUser = await getDbUser(user.id, user.email ?? "")

  if (!await isPremium(dbUser.id)) {
    return NextResponse.json({ savedIds: [], premium: false })
  }

  const saved = await prisma.savedOpportunity.findMany({
    where: { user_id: dbUser.id },
    select: { opportunity_id: true },
    orderBy: { saved_at: "desc" },
  })

  return NextResponse.json({
    savedIds: saved.map((s) => s.opportunity_id),
    premium: true,
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
  }

  const opportunityId = (body as Record<string, unknown>)?.opportunityId
  if (typeof opportunityId !== "string" || !opportunityId) {
    return NextResponse.json({ error: "opportunityId requis" }, { status: 400 })
  }

  const dbUser = await getDbUser(user.id, user.email ?? "")

  if (!await isPremium(dbUser.id)) {
    return NextResponse.json({ error: "Guide Premium requis pour sauvegarder des opportunités" }, { status: 403 })
  }

  const existing = await prisma.savedOpportunity.findUnique({
    where: { user_id_opportunity_id: { user_id: dbUser.id, opportunity_id: opportunityId } },
  })

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } })
  } else {
    const count = await prisma.savedOpportunity.count({ where: { user_id: dbUser.id } })
    if (count >= MAX_SAVED) {
      return NextResponse.json({ error: `Limite de ${MAX_SAVED} favoris atteinte`, limitReached: true }, { status: 400 })
    }
    await prisma.savedOpportunity.create({
      data: { user_id: dbUser.id, opportunity_id: opportunityId },
    })
  }

  const saved = await prisma.savedOpportunity.findMany({
    where: { user_id: dbUser.id },
    select: { opportunity_id: true },
    orderBy: { saved_at: "desc" },
  })

  return NextResponse.json({
    savedIds: saved.map((s) => s.opportunity_id),
    action: existing ? "unsaved" : "saved",
  })
}
