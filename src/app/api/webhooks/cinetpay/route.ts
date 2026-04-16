// TODO — Étape 3 : webhook CinetPay avec vérification HMAC + idempotence
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ received: true })
}
