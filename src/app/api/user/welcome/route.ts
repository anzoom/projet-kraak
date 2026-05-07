import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const dbUser = await prisma.user.upsert({
    where: { supabase_uid: user.id },
    update: {},
    create: {
      supabase_uid: user.id,
      email: user.email ?? "",
    },
  })

  if (dbUser.welcome_sent) {
    return NextResponse.json({ success: true })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "KRAAK <hello@kraak.co>",
      to: dbUser.email,
      subject: "Bienvenue sur KRAAK 🎉",
      html: buildWelcomeEmailHtml(dbUser.email),
    })

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { welcome_sent: true },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 })
  }
}

function buildWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:sans-serif;background:#f8f7f4;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e5e5;">

    <p style="font-size:40px;margin:0 0 16px;">🎉</p>
    <h1 style="font-size:22px;font-weight:900;color:#1a1a2e;margin:0 0 8px;line-height:1.3;">
      Bienvenue sur KRAAK !
    </h1>
    <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
      Ton compte est actif. Il ne te reste qu'une chose à faire pour découvrir les opportunités faites pour toi.
    </p>

    <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#c2410c;margin:0 0 4px;">Étape 1 — Fais ton test de profil</p>
      <p style="font-size:13px;color:#6b7280;margin:0;line-height:1.5;">
        10 questions, 3 minutes. Réponds pour obtenir des recommandations personnalisées parmi des centaines d'opportunités.
      </p>
    </div>

    <a href="https://kraak.co/test"
       style="display:block;text-align:center;background:#f97316;color:#fff;font-weight:700;font-size:14px;padding:14px 24px;border-radius:50px;text-decoration:none;margin-bottom:24px;">
      Faire mon test de profil →
    </a>

    <div style="border-top:1px solid #f3f4f6;padding-top:20px;">
      <p style="font-size:12px;font-weight:700;color:#374151;margin:0 0 12px;">Ce que KRAAK peut faire pour toi :</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">🎓 Bourses d'études</td>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">🌍 Programmes internationaux</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">🏆 Fellowships & prix</td>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;">📋 Concours & compétitions</td>
        </tr>
      </table>
    </div>

    <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;text-align:center;">
      Cet email a été envoyé à ${email} — KRAAK
    </p>
  </div>
</body>
</html>`
}
