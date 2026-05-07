import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server";

export default async function CtaSection() {
  const supabase = await createSupabaseServerAnonClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-primary-light">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center h-7 px-4 rounded-full bg-white border border-orange-200 text-primary text-xs font-bold mb-5">
          🧪 Phase bêta gratuite — accès immédiat
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-4 leading-tight">
          {isAuthenticated
            ? "Continue ta recherche d'opportunités"
            : "Prêt à découvrir les opportunités faites pour toi ?"}
        </h2>
        <p className="text-lg text-slate-mid mb-8 max-w-md mx-auto leading-relaxed">
          {isAuthenticated
            ? "Retrouve tes recommandations personnalisées et explore de nouvelles opportunités."
            : "Gratuit, rapide et pensé pour les étudiants africains. Teste ton profil et rejoins la bêta KRAAK maintenant."}
        </p>
        <Link
          href={isAuthenticated ? "/results" : "/test"}
          className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200"
        >
          {isAuthenticated ? "Voir mes résultats" : "Voir mes résultats en < 1 min"}
          <ArrowRight className="w-5 h-5" />
        </Link>
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-slate-mid">
            Aucun paiement · Aucun engagement · Résultat en moins de 1 minute
          </p>
        )}
      </div>
    </section>
  );
}
