import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const now = new Date()

  const bookings = await prisma.coachingBooking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      expires_at: { gt: now },
    },
    select: { date: true, slot: true, status: true },
  })

  return NextResponse.json({ bookings })
}
