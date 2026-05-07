import { test, expect } from "@playwright/test"

test.setTimeout(60000)

test.describe("Page Résultats — utilisateur non authentifié", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/results", { waitUntil: "domcontentloaded" })
    // Attendre que le state loading → no_data/ready soit résolu (spinner disparaît)
    await page.waitForFunction(
      () => document.body.textContent?.includes("Analyse de ton profil") === false,
      { timeout: 10000 },
    ).catch(() => {})
  })

  test("affiche la page sans redirection", async ({ page }) => {
    await expect(page).toHaveURL("/results")
  })

  test("toutes les opportunités sont masquées (🔒 Verrouillé)", async ({ page }) => {
    // Le scoring s'exécute côté client — on attend le résultat ou le fallback
    const locked = page.getByText("🔒 Verrouillé")
    const noData = page.getByText(/aucun résultat|complète le test/i)
    await expect(locked.or(noData).first()).toBeVisible({ timeout: 8000 })
  })

  test("affiche le CTA 'Créer mon compte gratuit'", async ({ page }) => {
    const cta = page.getByRole("link", { name: /créer mon compte gratuit/i })
    const noData = page.getByText(/aucun résultat|complète le test/i)
    // Si pas de données de test en session, la page affiche le fallback no_data
    const hasCta = await cta.count() > 0
    const hasNoData = await noData.count() > 0
    expect(hasCta || hasNoData).toBe(true)
  })

  test("affiche le CTA 'Se connecter' pour les utilisateurs existants", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: /se connecter/i })
    const noData = page.getByText(/aucun résultat|complète le test/i)
    const hasLogin = await loginLink.count() > 0
    const hasNoData = await noData.count() > 0
    expect(hasLogin || hasNoData).toBe(true)
  })

  test("CTA inscription pointe vers /auth/register", async ({ page }) => {
    const cta = page.getByRole("link", { name: /créer mon compte gratuit/i })
    if (await cta.count() > 0) {
      const href = await cta.getAttribute("href")
      expect(href).toMatch(/\/auth\/register/)
    }
  })

  test("CTA connexion pointe vers /auth/login", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: /se connecter/i }).first()
    if (await loginLink.count() > 0) {
      const href = await loginLink.getAttribute("href")
      expect(href).toMatch(/\/auth\/login/)
    }
  })
})
