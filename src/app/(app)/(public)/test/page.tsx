import type { Metadata } from "next"
import TestStepper from "@/components/features/test/TestStepper"

export const metadata: Metadata = {
  title: "Test de profil — KRAAK",
  description:
    "Réponds à 10 questions pour découvrir les opportunités qui correspondent à ton profil.",
}

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const { welcome } = await searchParams
  const showWelcome = welcome === "1"

  return (
    <div className="flex flex-col bg-slate-light">
      {showWelcome && (
        <div className="bg-primary text-white px-4 py-3 text-center">
          <p className="text-sm font-semibold">
            🎉 Bienvenue sur KRAAK ! Réponds à ces 10 questions pour découvrir tes opportunités.
          </p>
        </div>
      )}

      <main className="flex-1 flex items-start justify-center">
        <TestStepper />
      </main>
    </div>
  )
}
