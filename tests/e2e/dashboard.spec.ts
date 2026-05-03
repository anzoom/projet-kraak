import { test, expect } from "@playwright/test"

test.describe("Page Profil /dashboard", () => {
  test("redirige vers /auth/login si non authentifié", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("page /auth/login affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: /connexion|connecte/i })).toBeVisible()
  })
})

test.describe("Navbar — état non authentifié", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
  })

  test("affiche 'Se connecter' et 'S'inscrire' si non connecté", async ({ page }) => {
    await expect(page.getByRole("link", { name: /se connecter/i }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /s'inscrire/i })).toBeVisible()
  })

  test("n'affiche pas 'Mon profil' (lien dashboard) si non connecté", async ({ page }) => {
    const profileLink = page.getByRole("link", { name: "Mon profil", exact: true })
    await expect(profileLink).toHaveCount(0)
  })

  test("n'affiche pas 'Mes résultats' dans la navbar si non connecté", async ({ page }) => {
    const navResultsLink = page.locator("header").getByRole("link", { name: /mes résultats/i })
    await expect(navResultsLink).toHaveCount(0)
  })
})
