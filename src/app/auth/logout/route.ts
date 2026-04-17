import { NextResponse } from "next/server"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createSupabaseServerAnonClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"))
}
