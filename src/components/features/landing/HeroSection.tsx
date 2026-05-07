import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server";

export default async function HeroSection() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <section className="bg-primary-light px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="max-w-5xl mx-auto text-center">

        {/* Badge bêta */}
        <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Bêta gratuite ouverte · Résultat en moins de 1 minute
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-dark leading-tight tracking-tight mb-5">
          Trouve les opportunités faites
          <span className="text-primary block">pour ton profil.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-mid max-w-xl mx-auto mb-4 leading-relaxed">
          KRAAK analyse ton profil en 10 questions et sélectionne les bourses, programmes et
          fellowships qui correspondent vraiment à ta situation — pour les étudiants africains et
          la diaspora.
        </p>

        <p className="text-sm text-slate-mid/80 mb-8 max-w-md mx-auto bg-white/60 rounded-full px-4 py-2 border border-orange-100">
          🧪 KRAAK est en phase bêta gratuite. Nous testons le service avec les premiers utilisateurs
          afin de construire une solution vraiment utile.
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/test"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200"
              >
                Voir mes résultats en &lt; 1 min
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-mid">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </>
        )}

        {!session && (
          <p className="mt-3 text-xs text-slate-mid/70">
            Aucune carte bancaire · Aucun engagement · 100% gratuit pendant la bêta
          </p>
        )}
      </div>
    </section>
  );
}
