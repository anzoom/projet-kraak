import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import PaymentForm from "@/components/features/payment/PaymentForm"

export const metadata: Metadata = {
  title: "Paiement — KRAAK",
  description: "Débloque l'accès complet à tes recommandations personnalisées.",
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ locked_count?: string }>
}) {
  const params = await searchParams
  const lockedCount = parseInt(params.locked_count ?? "0", 10)

  if (lockedCount === 0) {
    redirect("/test")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-light">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center">
        <Link href="/" className="text-xl font-black text-slate-dark tracking-tight">
          KRAAK
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <PaymentForm lockedCount={lockedCount} />
      </main>
    </div>
  )
}
