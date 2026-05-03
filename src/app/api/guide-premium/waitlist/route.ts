import { NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  const {
    email,
    source = "landing",
    first_name,
    country,
    education_level,
    domain,
    opportunity_type,
    interest,
    pain_point,
  } = body as Record<string, string | undefined>

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 })
  }

  const cleanEmail = email.toLowerCase().trim()

  try {
    await prisma.waitlistEntry.create({
      data: {
        email: cleanEmail,
        source,
        first_name: first_name?.trim() || null,
        country: country?.trim() || null,
        education_level: education_level?.trim() || null,
        domain: domain?.trim() || null,
        opportunity_type: opportunity_type?.trim() || null,
        interest: interest?.trim() || null,
        pain_point: pain_point?.trim() || null,
      },
    })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code !== "P2002") {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
    // Email déjà inscrit — on retourne succès silencieusement
  }

  void sendConfirmationEmail(cleanEmail, first_name?.trim())

  return NextResponse.json({ success: true })
}

async function sendConfirmationEmail(email: string, firstName?: string) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const name = firstName || "toi"
    const result = await resend.emails.send({
      from: "KRAAK <hello@kraak.co>",
      to: email,
      subject: "Tu es dans la bêta KRAAK 🎉 — on construit ça pour toi",
      html: buildConfirmationHtml(name),
    })
    console.log("[waitlist] email sent:", JSON.stringify(result))
  } catch (err) {
    console.error("[waitlist] email error:", err)
  }
}

function buildConfirmationHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:sans-serif;background:#f8f7f4;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e5e5;">
    <p style="font-size:36px;margin:0 0 16px;">🚀</p>
    <h1 style="font-size:22px;font-weight:900;color:#1a1a2e;margin:0 0 8px;">
      Bienvenue dans la bêta KRAAK, ${name} !
    </h1>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px;line-height:1.7;">
      Tu fais partie des premiers à tester KRAAK. On construit cette plateforme pour les
      étudiants africains et la diaspora qui méritent un accès aux meilleures opportunités
      mondiales — et ton retour va directement nous aider à l'améliorer.
    </p>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#c2410c;margin:0 0 10px;">
        Ce que tu as maintenant accès :
      </p>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#6b7280;line-height:2.2;">
        <li>Test de profil — identifie les opportunités faites pour toi</li>
        <li>Jusqu'à 5 recommandations personnalisées basées sur ton profil</li>
        <li>Guide d'orientation (bientôt 9 modules complets)</li>
        <li>Alertes nouvelles opportunités dès le lancement</li>
      </ul>
    </div>
    <p style="font-size:13px;color:#6b7280;margin:0 0 20px;line-height:1.7;">
      <strong style="color:#1a1a2e;">La suite ?</strong> On te contacte dès que les fonctionnalités premium
      sont prêtes. Tu seras parmi les premiers avertis — et tu auras accès à des conditions spéciales
      réservées aux membres fondateurs.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/test"
       style="display:block;text-align:center;background:#f97316;color:#fff;font-weight:700;font-size:14px;padding:14px;border-radius:999px;text-decoration:none;margin-bottom:20px;">
      Démarrer le test de profil →
    </a>
    <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;line-height:1.6;">
      KRAAK — Trouve les opportunités faites pour toi<br/>
      Des questions ? <a href="mailto:hello@kraak.co" style="color:#f97316;">hello@kraak.co</a>
    </p>
  </div>
</body>
</html>`
}
