import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function getDbUser(supabaseUid: string, email: string) {
  return prisma.user.upsert({
    where: { supabase_uid: supabaseUid },
    update: {},
    create: { supabase_uid: supabaseUid, email },
  })
}

export async function GET() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const dbUser = await getDbUser(user.id, user.email ?? "")
  return NextResponse.json({ alerts_enabled: dbUser.alerts_enabled })
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

  const enabled = (body as Record<string, unknown>)?.enabled
  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "enabled (boolean) requis" }, { status: 400 })
  }

  const dbUser = await getDbUser(user.id, user.email ?? "")
  const updated = await prisma.user.update({
    where: { id: dbUser.id },
    data: { alerts_enabled: enabled },
  })

  return NextResponse.json({ alerts_enabled: updated.alerts_enabled })
}
