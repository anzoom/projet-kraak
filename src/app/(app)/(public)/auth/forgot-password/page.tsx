import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Mot de passe oublié — KRAAK",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
