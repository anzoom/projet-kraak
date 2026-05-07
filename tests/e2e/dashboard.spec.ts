import { test, expect } from "@playwright/test"

test.setTimeout(60000)

test.describe("Page Profil /dashboard", () => {
  test("redirige vers /auth/login si non authentifié", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("page /auth/login affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { name: /connexion|connecte/i })).toBeVisible()
  })
})

test.describe("Navbar — état non authentifié", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
  })

  test("affiche 'Se connecter' et 'S'inscrire' si non connecté", async ({ page }) => {
    // "Se connecter" est un bouton navbar (ouvre une modale), "S'inscrire" est un lien
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible()
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
