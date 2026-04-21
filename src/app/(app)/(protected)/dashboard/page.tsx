import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import ProfileClient from "@/components/features/profile/ProfileClient"

export const metadata: Metadata = {
  title: "Mon profil — KRAAK",
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <ProfileClient email={user.email ?? ""} />
}
