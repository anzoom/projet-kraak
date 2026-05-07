import { NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

export async function POST() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Chercher la session de paiement en attente la plus récente
  const session = await prisma.checkoutSession.findFirst({
    where: {
      user_id: dbUser.id,
      status: "PENDING",
      expires_at: { gt: new Date() },
    },
    orderBy: { created_at: "desc" },
  })

  if (!session) {
    return NextResponse.json({ error: "Aucune session de paiement valide" }, { status: 404 })
  }

  // Idempotence : vérifier qu'il n'y a pas déjà un abonnement actif
  const existing = await prisma.guideSubscription.findFirst({
    where: {
      user_id: dbUser.id,
      status: "ACTIVE",
      current_period_end: { gt: new Date() },
    },
  })

  if (existing) {
    // Marquer la session comme complétée et retourner succès
    await prisma.checkoutSession.update({
      where: { id: session.id },
      data: { status: "COMPLETED" },
    })
    return NextResponse.json({ activated: true, already_active: true })
  }

  // Activer l'abonnement en transaction atomique
  await prisma.$transaction([
    prisma.checkoutSession.update({
      where: { id: session.id },
      data: { status: "COMPLETED" },
    }),
    prisma.guideSubscription.create({
      data: {
        user_id: dbUser.id,
        plan: session.plan,
        status: "ACTIVE",
        current_period_end: session.plan === "ANNUAL"
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ])

  // Email de bienvenue (non bloquant)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const planLabel = session.plan === "ANNUAL" ? "annuel" : "mensuel"
    await resend.emails.send({
      from: "KRAAK <bonjour@kraak.co>",
      to: dbUser.email,
      subject: "Bienvenue dans KRAAK Premium Guide 🎉",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b;">
  <h1 style="font-size:22px;font-weight:900;margin-bottom:4px;">Ton accès Premium Guide est activé !</h1>
  <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
    Merci pour ton abonnement ${planLabel}. Tu as maintenant accès au catalogue complet,
    aux 9 modules du guide interactif, aux alertes deadlines et à la newsletter.
  </p>
  <a href="${process.env.NEXT_PUBLIC_APP_URL}/guide"
     style="display:block;text-align:center;background:#f97316;color:#fff;font-weight:700;padding:14px;border-radius:999px;text-decoration:none;margin-top:20px;">
    Accéder au Guide Premium →
  </a>
</body>
</html>`,
    })
  } catch {
    // Non bloquant
  }

  return NextResponse.json({ activated: true })
}
