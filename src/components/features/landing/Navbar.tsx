import Link from "next/link";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-dark">
          KRAAK
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
            >
              Mon profil
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors min-w-[44px]"
            >
              Mes résultats
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-mid hover:text-slate-dark transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors min-w-[44px]"
            >
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
