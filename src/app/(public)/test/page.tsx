import type { Metadata } from "next"
import Link from "next/link"
import TestStepper from "@/components/features/test/TestStepper"

export const metadata: Metadata = {
  title: "Test de profil — KRAAK",
  description:
    "Réponds à 10 questions pour découvrir les opportunités qui correspondent à ton profil.",
}

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-light">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-slate-dark tracking-tight">
          KRAAK
        </Link>
        <span className="text-sm text-slate-mid">Test de profil</span>
      </header>

      <main className="flex-1 flex items-start justify-center">
        <TestStepper />
      </main>
    </div>
  )
}
