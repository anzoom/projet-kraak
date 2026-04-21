import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isAdmin = searchParams.get("all") === "1" &&
    searchParams.get("secret") === process.env.COACH_ADMIN_SECRET

  const now = new Date()

  if (isAdmin) {
    const bookings = await prisma.coachingBooking.findMany({
      orderBy: [{ status: "asc" }, { date: "asc" }, { slot: "asc" }],
    })
    return NextResponse.json({ bookings })
  }

  const bookings = await prisma.coachingBooking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      expires_at: { gt: now },
    },
    select: { date: true, slot: true, status: true },
  })

  return NextResponse.json({ bookings })
}
