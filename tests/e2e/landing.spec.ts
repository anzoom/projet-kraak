import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
  })

  test("affiche la promesse principale sans scroll", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 })
    await expect(h1).toBeVisible()
    await expect(h1).toContainText("opportunités")
  })

  test("CTA principal visible sans scroll sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    // Premier lien CTA de la page (hero) — .first() car CtaSection affiche le même texte
    const cta = page.getByRole("link", { name: /voir mes résultats/i }).first()
    await expect(cta).toBeVisible()
    const box = await cta.boundingBox()
    expect(box?.y).toBeLessThan(844)
  })

  test("CTA hero redirige vers /test", async ({ page }) => {
    await page.getByRole("link", { name: /voir mes résultats en/i }).first().click()
    await expect(page).toHaveURL("/test")
  })

  test("lien 'Se connecter' (hero) redirige vers /auth/login", async ({ page }) => {
    // Le lien "Se connecter" dans le paragraphe hero pointe vers /auth/login
    // (distinct du bouton navbar qui ouvre une modale)
    const heroLink = page.locator("p").getByRole("link", { name: /se connecter/i })
    await expect(heroLink).toBeVisible()
    const href = await heroLink.getAttribute("href")
    expect(href).toMatch(/\/auth\/login/)
  })

  test("sections bénéfices et réassurance présentes", async ({ page }) => {
    await expect(page.getByText(/bourses|formations|programmes/i).first()).toBeVisible()
  })

  test("responsive mobile — pas de scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
