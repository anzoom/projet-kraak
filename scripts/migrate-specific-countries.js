/**
 * Migration : mise à jour des pays/zones vers des pays spécifiques
 *
 * Utilisation :
 *   node scripts/migrate-specific-countries.js [--dry-run]
 *
 * En mode --dry-run, affiche les changements prévus sans écrire en BDD.
 * Sans --dry-run, applique les mises à jour et affiche un rapport.
 *
 * La DB_URL est lue depuis la variable d'environnement DATABASE_URL,
 * ou peut être passée en argument : node ... --db-url=postgresql://...
 */

require("dotenv").config({ path: ".env.local" })
const { Client } = require("pg")

const DRY_RUN = process.argv.includes("--dry-run")
const DB_URL = (() => {
  const idx = process.argv.findIndex((a) => a.startsWith("--db-url="))
  if (idx !== -1) return process.argv[idx].replace("--db-url=", "")
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL
})()

if (!DB_URL) {
  console.error("❌ Variable DATABASE_URL introuvable. Lance avec --db-url=postgresql://... ou définis DATABASE_URL dans .env.local")
  process.exit(1)
}

// ── Règles de détection ─────────────────────────────────────────────────────

/**
 * Retourne le pays spécifique déduit du titre et de l'URL source.
 * Retourne null si aucune règle ne s'applique (garder la valeur existante).
 */
function detectCountry(title, sourceUrl) {
  const t = (title ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  const u = (sourceUrl ?? "").toLowerCase()

  // ── France ──────────────────────────────────────────────────────────────
  if (
    /\bfrance\b/.test(t) || /\bparis\b/.test(t) || /\blyon\b/.test(t) ||
    /\bmarseille\b/.test(t) || /\brennes\b/.test(t) || /\bbordeau/.test(t) ||
    /\beiffel\b/.test(t) || /sciences.?po/.test(t) ||
    /hec.{0,5}paris/.test(t) || /\bcampus.?france\b/.test(t) ||
    /\binserm\b/.test(t) || /\bcentralesupelec\b/.test(t) ||
    /\binsa.{0,5}lyon\b/.test(t) || /\b(chu|chru)\b/.test(t) ||
    /\bstation.?f\b/.test(t) || /\bcarrefour\b/.test(t) ||
    /\behesp\b/.test(t) || /\bsfere\b/.test(t) || /\bpantheon/.test(t) ||
    u.includes("campusfrance.org") || u.includes(".fr/") || u.endsWith(".fr") ||
    /\bloreal\b/.test(t) || /cms.{0,3}francis/.test(t)
  ) return "france"

  // ── Allemagne ──────────────────────────────────────────────────────────
  if (
    /\ballemagne\b/.test(t) || /\bberlin\b/.test(t) || /\bmunich\b/.test(t) ||
    /\bfrancfort\b/.test(t) || /\bwalldorf\b/.test(t) ||
    /\bdaad\b/.test(t) || /\bhumboldt\b/.test(t) || /\bsap\b/.test(t) ||
    u.includes("daad.de") || u.includes("humboldt-foundation.de") ||
    u.includes("sap.com") || u.endsWith(".de") || u.includes(".de/")
  ) return "allemagne"

  // ── Belgique ──────────────────────────────────────────────────────────
  if (
    /\bbelgique\b/.test(t) || /\bbruxelles\b/.test(t) || /\blouvain\b/.test(t) ||
    /\bulb\b/.test(t) || /\buclouvain\b/.test(t) || /\bunilever\b/.test(t) ||
    u.includes("uclouvain.be") || u.includes("ulb.ac.be") ||
    u.endsWith(".be") || u.includes(".be/")
  ) return "belgique"

  // ── Suisse ────────────────────────────────────────────────────────────
  if (
    /\bsuisse\b/.test(t) || /\bgeneve\b/.test(t) || /\bzurich\b/.test(t) ||
    /\bcern\b/.test(t) || /\bepfl\b/.test(t) || /\beth.?zurich\b/.test(t) ||
    u.includes("cern.ch") || u.endsWith(".ch") || u.includes(".ch/")
  ) return "suisse"

  // ── Royaume-Uni ───────────────────────────────────────────────────────
  if (
    /\broyaume.?uni\b/.test(t) || /\bangleterre\b/.test(t) ||
    /\blondres\b/.test(t) || /\boxford\b/.test(t) || /\bcambridge\b/.test(t) ||
    u.endsWith(".uk") || u.includes(".uk/") || u.includes(".ac.uk")
  ) return "royaume_uni"

  // ── Danemark ──────────────────────────────────────────────────────────
  if (
    /\bdanemark\b/.test(t) || /\bcopenhague\b/.test(t) || /\bcbs\b/.test(t) ||
    /copenhagen.?business/.test(t) ||
    u.includes("cbs.dk") || u.endsWith(".dk") || u.includes(".dk/")
  ) return "danemark"

  // ── Suède ─────────────────────────────────────────────────────────────
  if (
    /\bsuede\b/.test(t) || /\bstockholm\b/.test(t) || /\bkth\b/.test(t) ||
    u.includes("kth.se") || u.endsWith(".se") || u.includes(".se/")
  ) return "suede"

  // ── Pays-Bas ──────────────────────────────────────────────────────────
  if (
    /\bpays.?bas\b/.test(t) || /\bamsterdam\b/.test(t) || /\buttrecht\b/.test(t) ||
    u.includes(".nl/") || u.endsWith(".nl")
  ) return "pays_bas"

  // ── Espagne ───────────────────────────────────────────────────────────
  if (
    /\bespagne\b/.test(t) || /\bmadrid\b/.test(t) || /\bbarcelone\b/.test(t) ||
    u.endsWith(".es") || u.includes(".es/")
  ) return "espagne"

  // ── Canada ────────────────────────────────────────────────────────────
  if (
    /\bcanada\b/.test(t) || /\bmontre[ae]l\b/.test(t) || /\bquebec\b/.test(t) ||
    /\bhec.{0,5}montr/.test(t) || /\bpolytechnique.{0,10}montr/.test(t) ||
    /\bvanier\b/.test(t) || /\blaval\b/.test(t) || /\bmcgill\b/.test(t) ||
    /\bcrdi\b/.test(t) || /\bircc\b/.test(t) || /\bshopify\b/.test(t) ||
    /\bmila\b/.test(t) || /\brbc\b/.test(t) || /banque.{0,5}td/.test(t) ||
    u.includes(".ca/") || u.endsWith(".ca") || u.includes("vanier.gc.ca") ||
    u.includes("idrc.ca") || u.includes("hec.ca") || u.includes("mcgill.ca")
  ) return "canada"

  // ── États-Unis ────────────────────────────────────────────────────────
  if (
    /\betats.?unis\b/.test(t) || /\busa\b/.test(t) || /\bamerique\b/.test(t) ||
    /\bnew.?york\b/.test(t) || /\bsilicon.?valley\b/.test(t) ||
    /\bstanford\b/.test(t) || /\bmit\b/.test(t) || /\bcolumbia\b/.test(t) ||
    /\bfulbright\b/.test(t) || /\bnsf\b/.test(t) || /\bgoogle\b/.test(t) ||
    /\bamazon\b/.test(t) || /open.?society/.test(t) || /\baauw\b/.test(t) ||
    u.includes("fulbrightonline.org") || u.includes("nsfgrfp.org") ||
    u.includes("stanford.edu") || u.includes("mit.edu") ||
    u.includes("columbia.edu") || u.includes("opensocietyfoundations.org") ||
    u.includes("aauw.org") || u.includes("amazon.jobs") ||
    u.includes("summerofcode.withgoogle.com") || u.includes("un.org/en") ||
    u.includes("ssir.org")
  ) return "etats_unis"

  // ── Maroc ─────────────────────────────────────────────────────────────
  if (
    /\bmaroc\b/.test(t) || /\bifrane\b/.test(t) || /\bum6p\b/.test(t) ||
    /al.?akhawayn/.test(t) || /ben.?guerir/.test(t) ||
    u.includes("aui.ma") || u.includes("um6p.ma") ||
    u.endsWith(".ma") || u.includes(".ma/")
  ) return "maroc"

  // ── Sénégal ───────────────────────────────────────────────────────────
  if (
    /\bsenegal\b/.test(t) || /\bdakar\b/.test(t) ||
    /\bcesti\b/.test(t) || /pasteur.{0,5}dakar/.test(t) || /\bcisco.{0,20}senegal/.test(t) ||
    u.includes("ucad.sn") || u.includes("pasteur.sn") ||
    u.endsWith(".sn") || u.includes(".sn/")
  ) return "senegal"

  // ── Côte d'Ivoire ─────────────────────────────────────────────────────
  if (
    /\bcote.{0,3}ivoire\b/.test(t) || /\babidjan\b/.test(t) ||
    /\binphb\b/.test(t) || /\bensa\b/.test(t) ||
    u.includes("inphb.ci") || u.endsWith(".ci") || u.includes(".ci/")
  ) return "cote_ivoire"

  // ── Chine ─────────────────────────────────────────────────────────────
  if (
    /\bchine\b/.test(t) || /\bpekin\b/.test(t) || /\bshanghai\b/.test(t) ||
    /\btsinghua\b/.test(t) || /\bcsc\b/.test(t) || /\bpku\b/.test(t) ||
    /gouvernement.{0,10}chinois/.test(t) || /bourse.{0,15}csc/.test(t) ||
    u.includes("campuschina.org") || u.endsWith(".cn") || u.includes(".cn/")
  ) return "chine"

  return null
}

// ── Script principal ─────────────────────────────────────────────────────────

async function main() {
  const client = new Client({ connectionString: DB_URL })
  await client.connect()
  console.log(`🔌 Connecté à la BDD${DRY_RUN ? " (mode dry-run)" : ""}`)

  const { rows } = await client.query(
    "SELECT id, title, country, source_url FROM opportunities ORDER BY id"
  )

  console.log(`\n📋 ${rows.length} opportunités trouvées\n`)

  const updates = []
  const skipped = []
  const noChange = []

  for (const row of rows) {
    const detected = detectCountry(row.title, row.source_url)

    if (!detected) {
      skipped.push({ id: row.id, title: row.title, country: row.country })
    } else if (detected === row.country) {
      noChange.push(row.id)
    } else {
      updates.push({ id: row.id, title: row.title, from: row.country, to: detected })
    }
  }

  // Affichage du plan
  console.log(`✅ Sans changement : ${noChange.length}`)
  console.log(`🔄 À mettre à jour : ${updates.length}`)
  console.log(`⚠️  Non détectés (à vérifier manuellement) : ${skipped.length}\n`)

  if (updates.length > 0) {
    console.log("── Mises à jour prévues ────────────────────────────────────────")
    for (const u of updates) {
      console.log(`  [${u.id}] ${u.title}`)
      console.log(`        ${u.from}  →  ${u.to}`)
    }
    console.log("")
  }

  if (skipped.length > 0) {
    console.log("── Non détectés (vérification admin Payload requise) ────────────")
    for (const s of skipped) {
      console.log(`  [${s.id}] ${s.title}  (zone actuelle: ${s.country})`)
    }
    console.log("")
  }

  if (!DRY_RUN && updates.length > 0) {
    console.log("⏳ Application des mises à jour…")
    let done = 0
    for (const u of updates) {
      await client.query("UPDATE opportunities SET country = $1 WHERE id = $2", [u.to, u.id])
      done++
    }
    console.log(`✅ ${done} opportunités mises à jour.`)

    // Rapport final
    const { rows: after } = await client.query(
      "SELECT country, COUNT(*) as n FROM opportunities GROUP BY country ORDER BY country"
    )
    console.log("\n── Distribution par pays/zone après migration ───────────────────")
    for (const r of after) {
      console.log(`  ${r.country.padEnd(20)} ${r.n}`)
    }
  }

  if (DRY_RUN) {
    console.log("ℹ️  Mode dry-run — aucune modification appliquée.")
    console.log("   Relance sans --dry-run pour appliquer.")
  }

  await client.end()
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message)
  process.exit(1)
})
