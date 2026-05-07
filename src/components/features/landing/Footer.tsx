import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-dark px-4 sm:px-6 pt-10 pb-8">
      <div className="max-w-5xl mx-auto">

        {/* Top — brand + nav columns */}
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <div className="flex-1">
            <span className="font-black text-white text-xl tracking-tight">KRAAK</span>
            <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
              La plateforme qui connecte les étudiants africains aux meilleures opportunités mondiales.
            </p>
          </div>

          <div className="flex gap-10 sm:gap-16">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Produit</p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <Link href="/test" className="hover:text-white transition-colors">Test de profil</Link>
                <Link href="/results" className="hover:text-white transition-colors">Mes résultats</Link>
                <Link href="/guide-premium" className="hover:text-white transition-colors">Guide Premium</Link>
                <Link href="/coaching" className="hover:text-white transition-colors">Coaching</Link>
              </nav>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Légal</p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
                <Link href="/conditions" className="hover:text-white transition-colors">Conditions</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {year} KRAAK. Tous droits réservés.</p>
          <p>Conçu pour les étudiants africains qui avancent.</p>
        </div>

      </div>
    </footer>
  );
}
