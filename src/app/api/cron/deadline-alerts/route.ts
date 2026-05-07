import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { seedOpportunities } from "@/data/seed-opportunities"

const ALERT_WINDOWS = [90, 30, 7] as const

function parseDeadline(raw: string | null | undefined): Date | null {
  if (!raw) return null
  // Formats attendus : "YYYY-MM-DD" ou "DD/MM/YYYY" ou "31 décembre 2026"
  const iso = Date.parse(raw)
  if (!isNaN(iso)) return new Date(iso)
  // Format FR : "31/12/2026"
  const parts = raw.split("/")
  if (parts.length === 3) {
    const d = Date.parse(`${parts[2]}-${parts[1]}-${parts[0]}`)
    if (!isNaN(d)) return new Date(d)
  }
  return null
}

function daysUntil(date: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function buildDeadlineEmailHtml(
  oppTitle: string,
  oppCategory: string,
  oppCountry: string,
  oppDeadline: string,
  oppUrl: string | null | undefined,
  daysLeft: number,
): string {
  const urgencyColor = daysLeft <= 7 ? "#dc2626" : daysLeft <= 30 ? "#f97316" : "#16a34a"
  const urgencyLabel = daysLeft <= 7 ? "🚨 Urgent" : daysLeft <= 30 ? "⏰ Bientôt" : "📅 Rappel"

  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b;">
  <h1 style="font-size:20px;font-weight:900;margin-bottom:4px;">${urgencyLabel} — Deadline dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}</h1>
  <p style="color:#6b7280;font-size:13px;margin-bottom:20px;">
    Tu as sauvegardé une opportunité dont la deadline approche.
  </p>
  <div style="border:2px solid ${urgencyColor};border-radius:12px;padding:16px;margin-bottom:16px;">
    <p style="font-weight:700;font-size:15px;margin:0 0 4px;">${oppTitle}</p>
    <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">${oppCategory} · ${oppCountry}</p>
    <p style="color:${urgencyColor};font-size:13px;font-weight:600;margin:0 0 12px;">
      Deadline : ${oppDeadline} (J-${daysLeft})
    </p>
    ${oppUrl ? `<a href="${oppUrl}" style="color:#f97316;font-weight:600;font-size:13px;">Postuler maintenant →</a>` : ""}
  </div>
  <a href="${process.env.NEXT_PUBLIC_APP_URL}/guide"
     style="display:block;text-align:center;background:#f97316;color:#fff;font-weight:700;padding:14px;border-radius:999px;text-decoration:none;margin-top:20px;">
    Voir mes opportunités sauvegardées
  </a>
  <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px;">
    Tu reçois cet email car tu as activé les alertes deadlines sur
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#9ca3af;">KRAAK</a>.
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

  // Uniquement les abonnés Guide Premium actifs
  const premiumUsers = await prisma.user.findMany({
    where: {
      guide_subscriptions: {
        some: {
          status: "ACTIVE",
          current_period_end: { gt: new Date() },
        },
      },
    },
    include: {
      saved_opportunities: {
        include: {
          deadline_alert_preference: {
            include: { sent_alerts: true },
          },
        },
      },
    },
  })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0
  let skipped = 0

  for (const user of premiumUsers) {
    for (const saved of user.saved_opportunities) {
      const opp = seedOpportunities.find((o) => o.id === saved.opportunity_id)
      if (!opp || !opp.deadline) { skipped++; continue }

      const deadline = parseDeadline(opp.deadline)
      if (!deadline) { skipped++; continue }

      const days = daysUntil(deadline)
      if (days < 0) { skipped++; continue } // deadline dépassée

      const pref = saved.deadline_alert_preference
      const alertConfig: Record<number, boolean> = {
        90: pref?.alert_90d ?? true,
        30: pref?.alert_30d ?? true,
        7: pref?.alert_7d ?? true,
      }

      for (const window of ALERT_WINDOWS) {
        // L'alerte se déclenche si on est à ±1 jour de la fenêtre
        if (Math.abs(days - window) > 1) continue
        if (!alertConfig[window]) continue

        // Vérifier si déjà envoyé
        const alreadySent = pref?.sent_alerts.some((a) => a.days_before === window)
        if (alreadySent) continue

        try {
          await resend.emails.send({
            from: "KRAAK <alertes@kraak.co>",
            to: user.email,
            subject: `⏰ Deadline dans ${days} jour${days > 1 ? "s" : ""} — ${opp.title}`,
            html: buildDeadlineEmailHtml(
              opp.title,
              opp.category,
              opp.country,
              opp.deadline,
              opp.source_url,
              days,
            ),
          })

          // Créer la préférence si elle n'existe pas encore, puis enregistrer l'envoi
          let prefId = pref?.id
          if (!prefId) {
            const created = await prisma.deadlineAlertPreference.create({
              data: {
                user_id: user.id,
                opportunity_id: saved.opportunity_id,
                saved_opp_id: saved.id,
              },
            })
            prefId = created.id
          }

          await prisma.sentDeadlineAlert.create({
            data: { pref_id: prefId, days_before: window },
          })

          sent++
        } catch {
          skipped++
        }
      }
    }
  }

  return NextResponse.json({ sent, skipped })
}
