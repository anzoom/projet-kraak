import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-primary-light px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Gratuit · Résultat en moins de 3 minutes
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-dark leading-tight tracking-tight mb-5">
          Trouve les opportunités
          <span className="text-primary block sm:inline"> faites pour toi.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-mid max-w-xl mx-auto mb-8 leading-relaxed">
          Réponds à 10 questions. KRAAK analyse ton profil et te trouve les
          bourses, formations et programmes qui te correspondent vraiment.
        </p>

        <Link
          href="/test"
          className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-white font-bold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-orange-200 min-w-[44px]"
        >
          Tester mon profil
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="mt-4 text-sm text-slate-mid">
          Déjà plus de 2 000 étudiants africains accompagnés
        </p>
      </div>
    </section>
  );
}
