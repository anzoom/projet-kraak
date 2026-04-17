import type { Metadata } from "next"
import { Suspense } from "react"
import LoginForm from "@/components/features/auth/LoginForm"

export const metadata: Metadata = {
  title: "Connexion — KRAAK",
  description: "Connecte-toi pour accéder à tes résultats et recommandations.",
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
