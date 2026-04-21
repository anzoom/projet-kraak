import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { computeScore } from "@/domain/scoring/scorer"
import { matchOpportunities } from "@/domain/matching/matcher"
import { seedOpportunities } from "@/data/seed-opportunities"
import type { Recommendation } from "@/types/scoring"
import type { TestAnswers } from "@/types/test"

function buildAlertEmailHtml(recommendations: Recommendation[], email: string): string {
  const unsubUrl = `https://kraak.co/dashboard`
  const cards = recommendations
    .slice(0, 3)
    .map(
      (rec) => `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;">
      <p style="font-weight:700;font-size:15px;margin:0 0 4px;">${rec.opportunity.title}</p>
      <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">${rec.opportunity.category} · ${rec.opportunity.country}</p>
      ${rec.opportunity.deadline ? `<p style="color:#f97316;font-size:12px;margin:0 0 8px;">Deadline : ${rec.opportunity.deadline}</p>` : ""}
      ${rec.opportunity.source_url ? `<a href="${rec.opportunity.source_url}" style="color:#f97316;font-weight:600;font-size:13px;">Postuler →</a>` : ""}
    </div>`,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b;">
  <h1 style="font-size:22px;font-weight:900;margin-bottom:4px;">3 opportunités te correspondent</h1>
  <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">Voici les meilleures opportunités pour ton profil cette semaine.</p>
  ${cards}
  <a href="https://kraak.co/results" style="display:block;text-align:center;background:#f97316;color:#fff;font-weight:700;padding:14px;border-radius:999px;text-decoration:none;margin-top:20px;">
    Voir tous mes résultats
  </a>
  <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px;">
    Tu reçois cet email car tu as activé les alertes sur <a href="${unsubUrl}" style="color:#9ca3af;">KRAAK</a>.<br>
    Pour te désinscrire, désactive les alertes dans ton profil.
  </p>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      where: { alerts_enabled: true },
      include: {
        test_responses: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    })

    let sent = 0
    let skipped = 0

    for (const user of users) {
      const lastResponse = user.test_responses[0]
      if (!lastResponse) {
        skipped++
        continue
      }

      let answers: TestAnswers
      try {
        answers = lastResponse.answers as TestAnswers
        if (!answers || typeof answers !== "object") throw new Error("invalid")
      } catch {
        skipped++
        continue
      }

      const score = computeScore(answers)
      const recommendations = matchOpportunities({
        score,
        answers,
        opportunities: seedOpportunities,
      })

      if (recommendations.length === 0) {
        skipped++
        continue
      }

      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: "KRAAK <alertes@kraak.co>",
          to: user.email,
          subject: "3 opportunités correspondent à ton profil",
          html: buildAlertEmailHtml(recommendations, user.email),
        })
        sent++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ sent, skipped })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
