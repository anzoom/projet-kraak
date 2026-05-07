/**
 * Crée un utilisateur de test avec accès premium (GuideSubscription ACTIVE 1 an).
 * Usage : npx tsx scripts/create-test-premium-user.ts
 */
import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { resolve } from "path"

// Parse .env.local manually (no dotenv dependency)
const envPath = resolve(process.cwd(), ".env.local")
const envLines = readFileSync(envPath, "utf-8").split("\n")
for (const line of envLines) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eq = trimmed.indexOf("=")
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  let val = trimmed.slice(eq + 1).trim()
  val = val.replace(/\s+#.*$/, "")       // strip inline comments
  val = val.replace(/^["']|["']$/g, "") // strip surrounding quotes
  if (!process.env[key]) process.env[key] = val
}

const TEST_EMAIL = "test-premium@kraak.co"
const TEST_PASSWORD = "TestKraak2026!"

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local")
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const prisma = new PrismaClient()

  try {
    // 1. Créer l'utilisateur Supabase (ou récupérer s'il existe déjà)
    let supabaseUid: string

    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existing = existingUsers?.users.find((u) => u.email === TEST_EMAIL)

    if (existing) {
      console.log(`ℹ️  Utilisateur Supabase déjà existant : ${existing.id}`)
      supabaseUid = existing.id
      // Mettre à jour le mot de passe au cas où
      await supabase.auth.admin.updateUserById(supabaseUid, { password: TEST_PASSWORD })
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
      })
      if (error || !data.user) throw new Error(`Supabase createUser : ${error?.message}`)
      supabaseUid = data.user.id
      console.log(`✅ Utilisateur Supabase créé : ${supabaseUid}`)
    }

    // 2. Créer ou récupérer le User Prisma
    let dbUser = await prisma.user.findUnique({ where: { supabase_uid: supabaseUid } })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { email: TEST_EMAIL, supabase_uid: supabaseUid },
      })
      console.log(`✅ User Prisma créé : ${dbUser.id}`)
    } else {
      console.log(`ℹ️  User Prisma déjà existant : ${dbUser.id}`)
    }

    // 3. Créer ou mettre à jour la GuideSubscription premium
    const existingSub = await prisma.guideSubscription.findFirst({
      where: { user_id: dbUser.id },
    })

    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    if (existingSub) {
      await prisma.guideSubscription.update({
        where: { id: existingSub.id },
        data: { status: "ACTIVE", current_period_end: oneYearFromNow },
      })
      console.log(`✅ GuideSubscription mise à jour (expire le ${oneYearFromNow.toLocaleDateString("fr-FR")})`)
    } else {
      await prisma.guideSubscription.create({
        data: {
          user_id: dbUser.id,
          plan: "ANNUAL",
          status: "ACTIVE",
          current_period_end: oneYearFromNow,
        },
      })
      console.log(`✅ GuideSubscription créée (expire le ${oneYearFromNow.toLocaleDateString("fr-FR")})`)
    }

    console.log("\n─────────────────────────────────────")
    console.log("  Compte test premium prêt :")
    console.log(`  Email    : ${TEST_EMAIL}`)
    console.log(`  Password : ${TEST_PASSWORD}`)
    console.log("─────────────────────────────────────\n")
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
