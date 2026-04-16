import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-primary-light">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-4 leading-tight">
          Prêt à découvrir les opportunités faites pour toi ?
        </h2>
        <p className="text-lg text-slate-mid mb-8 max-w-md mx-auto">
          Gratuit, rapide et personnalisé. Rejoins les milliers d'étudiants qui ont déjà trouvé leur voie avec KRAAK.
        </p>
        <Link
          href="/test"
          className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200"
        >
          Tester mon profil maintenant
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-4 text-sm text-slate-mid">
          Aucun compte requis pour démarrer · Résultat en moins de 3 minutes
        </p>
      </div>
    </section>
  );
}
