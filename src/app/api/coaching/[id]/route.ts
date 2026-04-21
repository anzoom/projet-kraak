import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

const DAY_NAMES_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const MONTH_NAMES_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

function formatDateLabel(dateStr: string, slot: string): string {
  const d = new Date(dateStr + "T12:00:00")
  return `${DAY_NAMES_LONG[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_LONG[d.getMonth()]} à ${slot}`
}

async function sendConfirmationEmail(email: string, date: string, slot: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const label = formatDateLabel(date, slot)
  const resend = new Resend(key)
  await resend.emails.send({
    from: "KRAAK <coaching@kraak.co>",
    to: email,
    subject: `Ton call coaching est confirmé — ${label}`,
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1e293b;">
  <h2 style="font-size:18px;font-weight:900;margin-bottom:12px;">✅ Call coaching confirmé !</h2>
  <p style="font-size:15px;margin-bottom:8px;">Ton créneau du <strong>${label}</strong> est confirmé.</p>
  <p style="font-size:14px;color:#6b7280;margin-bottom:20px;">
    Le coach te contactera sur WhatsApp à l'heure prévue. Assure-toi d'avoir WhatsApp installé et d'être disponible.
  </p>
  <a href="https://kraak.co/results" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;">
    Voir mes résultats →
  </a>
</div>`,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = request.headers.get("x-admin-secret")
  if (!secret || secret !== process.env.COACH_ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as { status: "CONFIRMED" | "CANCELLED" }

  if (!["CONFIRMED", "CANCELLED"].includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const booking = await prisma.coachingBooking.update({
    where: { id },
    data: { status: body.status },
  })

  if (body.status === "CONFIRMED" && booking.email) {
    sendConfirmationEmail(booking.email, booking.date, booking.slot).catch(() => {})
  }

  return NextResponse.json({ booking })
}
