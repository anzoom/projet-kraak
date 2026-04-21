import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

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

  const answers = (body as Record<string, unknown>)?.answers
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "answers requis" }, { status: 400 })
  }

  const dbUser = await prisma.user.upsert({
    where: { supabase_uid: user.id },
    update: {},
    create: {
      supabase_uid: user.id,
      email: user.email ?? "",
    },
  })

  // Idempotence : ne pas créer de doublon si les réponses sont identiques
  const answersJson = JSON.stringify(answers)
  const existing = await prisma.testResponse.findFirst({
    where: { user_id: dbUser.id },
    orderBy: { created_at: "desc" },
  })

  if (existing && JSON.stringify(existing.answers) === answersJson) {
    return NextResponse.json({ ok: true, created: false })
  }

  await prisma.testResponse.create({
    data: {
      user_id: dbUser.id,
      answers: answers as object,
      completed: true,
    },
  })

  return NextResponse.json({ ok: true, created: true })
}
