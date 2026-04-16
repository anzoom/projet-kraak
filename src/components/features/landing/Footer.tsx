import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-dark px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <span className="font-black text-white text-lg">KRAAK</span>
        <p>© {year} KRAAK. Tous droits réservés.</p>
        <nav className="flex gap-4">
          <Link href="/confidentialite" className="hover:text-white transition-colors">
            Confidentialité
          </Link>
          <Link href="/conditions" className="hover:text-white transition-colors">
            Conditions
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
