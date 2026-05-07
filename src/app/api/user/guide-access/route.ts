import { NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) {
    return NextResponse.json({ hasAccess: false })
  }

  const sub = await prisma.guideSubscription.findFirst({
    where: {
      user_id: dbUser.id,
      status: { in: ["ACTIVE", "CANCELLED"] },
      current_period_end: { gt: new Date() },
    },
    orderBy: { created_at: "desc" },
  })

  if (!sub) {
    return NextResponse.json({ hasAccess: false })
  }

  return NextResponse.json({
    hasAccess: true,
    plan: sub.plan,
    expiresAt: sub.current_period_end.toISOString(),
  })
}
