import type { Metadata } from "next"
import UpdatePasswordForm from "@/components/features/auth/UpdatePasswordForm"

export const metadata: Metadata = {
  title: "Nouveau mot de passe — KRAAK",
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />
}
