import Link from "next/link";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server";
import NavbarAuthButtons from "./NavbarAuthButtons";

export default async function Navbar() {
  const supabase = await createSupabaseServerAnonClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-dark">
          KRAAK
        </Link>
        <NavbarAuthButtons isLoggedIn={!!session} />
      </div>
    </header>
  );
}
