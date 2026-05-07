import { test, expect } from "@playwright/test"

test.setTimeout(90000)

const TEST_EMAIL = "test@kraak.app"
const TEST_PASSWORD = "TestKraak2026"

const JDD_ANSWERS = {
  origin_country: "senegal",
  current_level: "licence_3",
  main_objective: "bourse",
  domain: "sciences_tech",
  target_country: "peu_importe",
  budget: "confortable",
  academic_level: "licence",
  dossier_maturity: "avance",
  main_blocker: "information",
  timeline: "long",
}

async function setAnswers(page: import("@playwright/test").Page) {
  await page.evaluate((answers) => {
    localStorage.setItem(
      "kraak_anonymous_session",
      JSON.stringify({ state: { answers, currentStep: 10 }, version: 0 }),
    )
  }, JDD_ANSWERS)
}

async function tryLogin(page: import("@playwright/test").Page): Promise<boolean> {
  await page.goto("/auth/login", { waitUntil: "domcontentloaded" })
  // Attendre l'hydration React avant de soumettre (scope au form pour éviter le bouton navbar)
  const btn = page.locator("form").getByRole("button", { name: /se connecter/i })
  await expect(btn).toBeEnabled({ timeout: 15000 })
  await page.fill("#email", TEST_EMAIL)
  await page.fill("#password", TEST_PASSWORD)
  await btn.click()
  return page.waitForURL(/\/results/, { timeout: 10000 }).then(() => true).catch(() => false)
}

// ── 5.3 — paywall non authentifié ─────────────────────────────────────────────

test.describe("5.3 — Paywall non authentifié (auth gate)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await setAnswers(page)
    await page.goto("/results", { waitUntil: "domcontentloaded" })
    // Attendre que le paywall ou les résultats apparaissent
    await page.waitForFunction(
      () =>
        document.body.textContent?.includes("Créer mon compte") ||
        document.body.textContent?.includes("opportunités trouvées") ||
        document.body.textContent?.includes("recommandations"),
      { timeout: 15000 },
    ).catch(() => {})
  })

  test("affiche le bloc paywall avec CTA création de compte", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /créer mon compte gratuit/i }),
    ).toBeVisible({ timeout: 10000 })
  })

  test("5.4 — CTA 'créer mon compte gratuit' pointe vers /auth/register", async ({ page }) => {
    const cta = page.getByRole("link", { name: /créer mon compte gratuit/i })
    await expect(cta).toBeVisible({ timeout: 10000 })
    const href = await cta.getAttribute("href")
    expect(href).toMatch(/\/auth\/register/)
  })

  test("affiche le lien 'Se connecter' pour les utilisateurs existants", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /se connecter/i }).first(),
    ).toBeVisible({ timeout: 10000 })
  })

  test("les recommandations sont verrouillées (🔒 Bientôt disponible)", async ({ page }) => {
    await expect(page.getByText("🔒 Bientôt disponible").first()).toBeVisible({ timeout: 10000 })
  })
})

// ── 5.2 — résultats complets pour utilisateur connecté ────────────────────────

test("5.2 — /results affiche toutes les recommandations pour un utilisateur connecté", async ({ page }) => {
  // Nécessite test@kraak.app / TestKraak2026 dans Supabase — désactivé en local
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await setAnswers(page)

  const loggedIn = await tryLogin(page)
  if (!loggedIn) {
    return
  }

  await page.waitForLoadState("domcontentloaded")

  // Aucune opportunité verrouillée
  await expect(page.getByText("🔒 Bientôt disponible")).toHaveCount(0, { timeout: 10000 })

  // Au moins une recommandation visible
  const cards = page.locator('[class*="rounded-2xl"]').filter({ hasNotText: "🔒" })
  await expect(cards.first()).toBeVisible({ timeout: 10000 })

  // Le bloc paywall n'est pas affiché
  await expect(
    page.getByRole("link", { name: /créer mon compte gratuit/i }),
  ).toHaveCount(0)
})
