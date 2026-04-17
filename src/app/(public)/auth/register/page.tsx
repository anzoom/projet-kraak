import type { Metadata } from "next"
import { Suspense } from "react"
import RegisterForm from "@/components/features/auth/RegisterForm"

export const metadata: Metadata = {
  title: "Inscription — KRAAK",
  description: "Crée ton compte pour accéder à tes résultats personnalisés.",
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
