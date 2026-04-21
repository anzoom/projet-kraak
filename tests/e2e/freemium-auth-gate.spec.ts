import { test, expect } from "@playwright/test"

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

// ── 5.3 — paywall non authentifié ─────────────────────────────────────────────

test.describe("5.3 — Paywall non authentifié (auth gate)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAnswers(page)
    await page.goto("/results")
    await page.waitForLoadState("networkidle")
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

  test("les recommandations sont verrouillées (🔒 Verrouillé)", async ({ page }) => {
    await expect(page.getByText("🔒 Verrouillé").first()).toBeVisible({ timeout: 10000 })
  })
})

// ── 5.2 — résultats complets pour utilisateur connecté ────────────────────────

test("5.2 — /results affiche toutes les recommandations pour un utilisateur connecté", async ({ page }) => {
  await page.goto("/")
  await setAnswers(page)

  // Connexion
  await page.goto("/auth/login")
  await page.fill("#email", TEST_EMAIL)
  await page.fill("#password", TEST_PASSWORD)
  await page.click('[type="submit"]')
  await page.waitForURL("/results", { timeout: 20000 })
  await page.waitForLoadState("networkidle")

  // Aucune opportunité verrouillée
  await expect(page.getByText("🔒 Verrouillé")).toHaveCount(0, { timeout: 10000 })

  // Au moins une recommandation visible
  const cards = page.locator('[class*="rounded-2xl"]').filter({ hasNotText: "🔒" })
  await expect(cards.first()).toBeVisible({ timeout: 10000 })

  // Le bloc paywall n'est pas affiché
  await expect(
    page.getByRole("link", { name: /créer mon compte gratuit/i }),
  ).toHaveCount(0)
})
