import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Paiement confirmé — KRAAK Premium Guide",
}

async function activateSubscription(): Promise<{ ok: boolean; alreadyActive?: boolean }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/verify`,
      { method: "POST", cache: "no-store" },
    )
    if (!res.ok) return { ok: false }
    const data = await res.json()
    return { ok: data.activated === true, alreadyActive: data.already_active }
  } catch {
    return { ok: false }
  }
}

export default async function GuideSuccessPage() {
  // Vérifier que l'utilisateur est authentifié
  const supabase = await createSupabaseServerAnonClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/guide/success")
  }

  const result = await activateSubscription()

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-slate-light flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-14 h-14 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Activation impossible</h1>
          <p className="text-sm text-gray-500 mb-6">
            Nous n&apos;avons pas trouvé de paiement en attente pour ton compte.
            Si tu viens de payer, contacte-nous à <strong>support@kraak.co</strong>
            avec ta confirmation Chariow et nous activons ton accès sous 2h.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition text-center"
            >
              Contacter le support
            </Link>
            <Link
              href="/guide"
              className="inline-block text-gray-500 text-sm hover:underline text-center"
            >
              Retour au guide
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-light flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {result.alreadyActive ? "Accès déjà actif !" : "Ton accès Premium Guide est activé !"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Tu as maintenant accès au catalogue complet, aux 9 modules du guide interactif,
          aux alertes deadlines et à la newsletter.
        </p>
        <Link
          href="/guide"
          className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition"
        >
          Accéder au Guide Premium →
        </Link>
      </div>
    </main>
  )
}
