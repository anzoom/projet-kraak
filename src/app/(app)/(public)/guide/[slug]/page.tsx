import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Lock } from "lucide-react"
import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"
import { createSupabaseServerAnonClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { hasGuideAccess, extractPreview } from "@/lib/guide"
import { GUIDE_MODULES, getModuleBySlug, getPrevNextModules } from "@/content/guide/index"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return GUIDE_MODULES.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const module = getModuleBySlug(slug)
  if (!module) return {}
  return {
    title: `${module.icon} Module ${module.order} — ${module.title} | Guide KRAAK`,
    description: module.description,
  }
}

export default async function GuideModulePage({ params }: Props) {
  const { slug } = await params
  const module = getModuleBySlug(slug)
  if (!module) notFound()

  const mdxPath = path.join(
    process.cwd(),
    "src/content/guide",
    `0${module.order}-${slug}.mdx`
  )
  if (!fs.existsSync(mdxPath)) notFound()

  const rawSource = fs.readFileSync(mdxPath, "utf-8")

  const supabase = await createSupabaseServerAnonClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabase_uid: user.id },
      select: { id: true },
    })
    if (dbUser) {
      isPremium = await hasGuideAccess(dbUser.id)
    }
  }

  const source = isPremium ? rawSource : extractPreview(rawSource, 3)
  const { prev, next } = getPrevNextModules(slug)

  return (
    <div className="bg-slate-light">
      <main className="max-w-lg mx-auto px-4 py-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Guide
        </Link>

        {/* Module header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-mid mb-1">
            {module.icon} {module.order === 0 ? "Introduction" : `Module ${module.order} / ${GUIDE_MODULES.length - 1}`}
          </p>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight">
            {module.title}
          </h1>
        </div>

        {/* MDX content */}
        <article className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-dark prose-p:text-slate-mid prose-li:text-slate-mid prose-strong:text-slate-dark">
          <MDXRemote source={source} />
        </article>

        {/* Gate pour les non-premium */}
        {!isPremium && (
          <div className="mt-8 rounded-2xl border-2 border-orange-100 bg-orange-50 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-slate-dark mb-1">
              La suite est réservée aux membres Premium
            </p>
            <p className="text-sm text-slate-mid mb-4">
              Accède aux 9 modules complets pour 2 500 XOF/mois
            </p>
            {user ? (
              <Link
                href="/guide-premium"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors shadow-md shadow-orange-100"
              >
                Accéder au guide complet
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors shadow-md shadow-orange-100"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-dark font-semibold text-sm px-5 py-2.5 rounded-full border-2 border-gray-200 hover:border-primary/40 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Navigation prev/next — uniquement pour premium */}
        {isPremium && (
          <div className="mt-10 flex justify-between gap-4 pt-6 border-t border-gray-100">
            {prev ? (
              <Link
                href={`/guide/${prev.slug}`}
                className="flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>
                  <span className="block text-xs text-slate-mid">Module {prev.order}</span>
                  <span className="font-semibold text-slate-dark">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/guide/${next.slug}`}
                className="flex items-center gap-2 text-sm text-slate-mid hover:text-slate-dark transition-colors text-right ml-auto"
              >
                <span>
                  <span className="block text-xs text-slate-mid">Module {next.order}</span>
                  <span className="font-semibold text-slate-dark">{next.title}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
