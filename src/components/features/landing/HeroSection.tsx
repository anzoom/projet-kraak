import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server";

export default async function HeroSection() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <section className="bg-primary-light px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          100% gratuit · Résultat en moins de 3 minutes
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-dark leading-tight tracking-tight mb-5">
          Accède gratuitement aux meilleures opportunités
          <span className="text-primary block"> adaptées à ton profil.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-mid max-w-xl mx-auto mb-8 leading-relaxed">
          Réponds à 10 questions. KRAAK analyse ton profil et sélectionne les
          bourses, formations et programmes qui te correspondent vraiment.
        </p>

        {session ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/results"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200 min-w-[44px]"
            >
              Voir mes résultats
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border-2 border-primary text-primary font-bold text-base sm:text-lg hover:bg-white transition-colors min-w-[44px]"
            >
              Refaire le test
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200 min-w-[44px]"
            >
              Tester mon profil
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm text-slate-mid">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </>
        )}

        {!session && (
          <p className="mt-2 text-sm text-slate-mid">
            Déjà plus de 2 000 étudiants africains accompagnés
          </p>
        )}
      </div>
    </section>
  );
}
