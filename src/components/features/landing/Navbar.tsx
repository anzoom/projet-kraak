import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-dark">
          KRAAK
        </Link>
        <Link
          href="/test"
          className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors min-w-[44px]"
        >
          Démarrer le test
        </Link>
      </div>
    </header>
  );
}
