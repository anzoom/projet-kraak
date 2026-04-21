import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

const DAY_NAMES_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const MONTH_NAMES_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

function formatDateLabel(dateStr: string, slot: string): string {
  const d = new Date(dateStr + "T12:00:00")
  return `${DAY_NAMES_LONG[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_LONG[d.getMonth()]} à ${slot}`
}

async function sendCoachNotification(id: string, date: string, slot: string, email?: string | null) {
  const key = process.env.RESEND_API_KEY
  const coachEmail = process.env.COACH_EMAIL
  const adminSecret = process.env.COACH_ADMIN_SECRET
  if (!key || !coachEmail) return

  const label = formatDateLabel(date, slot)
  const adminUrl = `https://kraak.co/admin/coaching?secret=${adminSecret}`

  const resend = new Resend(key)
  await resend.emails.send({
    from: "KRAAK <noreply@kraak.co>",
    to: coachEmail,
    subject: `Nouvelle réservation coaching — ${label}`,
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1e293b;">
  <h2 style="font-size:18px;font-weight:900;margin-bottom:12px;">📅 Nouvelle demande de coaching</h2>
  <p style="font-size:15px;margin-bottom:8px;"><strong>Créneau :</strong> ${label}</p>
  ${email ? `<p style="font-size:15px;margin-bottom:8px;"><strong>Email :</strong> ${email}</p>` : ""}
  <p style="font-size:14px;color:#6b7280;margin-bottom:20px;">Cette réservation expire dans 24h si tu ne confirmes pas.</p>
  <a href="${adminUrl}" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;">
    Gérer les réservations →
  </a>
</div>`,
  })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { date?: string; slot?: string; email?: string }
  const { date, slot, email } = body

  if (!date || !slot || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(slot)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
  }

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  try {
    const booking = await prisma.coachingBooking.create({
      data: { date, slot, email: email ?? null, expires_at: expiresAt },
    })
    sendCoachNotification(booking.id, date, slot, email).catch(() => {})
    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json({ error: "Créneau déjà réservé" }, { status: 409 })
  }
}
