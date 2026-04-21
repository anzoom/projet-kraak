import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    return NextResponse.json({ booking })
  } catch {
    // Créneau déjà réservé (contrainte unique date+slot)
    return NextResponse.json({ error: "Créneau déjà réservé" }, { status: 409 })
  }
}
