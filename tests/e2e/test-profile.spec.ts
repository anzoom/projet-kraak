import { test, expect } from "@playwright/test"

// Helper : sélectionne une option dans le <select> natif visible sur la page
async function selectOption(page: import("@playwright/test").Page, value: string) {
  await page.locator("select").selectOption(value)
}

test.describe("Test de profil", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test")
    // Attendre que le stepper soit hydraté
    await expect(page.getByRole("button", { name: /suivant|voir mes résultats/i })).toBeVisible({ timeout: 15000 })
  })

  test("affiche la barre de progression", async ({ page }) => {
    // ProgressBar est un div avec texte "1 / 10" ou similaire, ou une balise progress
    const progressText = page.getByText(/1\s*\/\s*10/i)
    const progressBar = page.locator("progress, [role='progressbar']")
    const hasText = await progressText.count() > 0
    const hasBar = await progressBar.count() > 0
    expect(hasText || hasBar).toBe(true)
  })

  test("bouton Suivant désactivé sans réponse", async ({ page }) => {
    const next = page.getByRole("button", { name: /suivant/i })
    await expect(next).toBeDisabled()
  })

  test("sélectionner une réponse active le bouton Suivant", async ({ page }) => {
    await selectOption(page, "senegal")
    const next = page.getByRole("button", { name: /suivant/i })
    await expect(next).toBeEnabled()
  })

  test("navigation Précédent absente à la première question", async ({ page }) => {
    await expect(page.getByRole("button", { name: /précédent/i })).not.toBeVisible()
  })

  test("navigation Précédent visible après première question", async ({ page }) => {
    await selectOption(page, "senegal")
    await page.getByRole("button", { name: /suivant/i }).click()
    await expect(page.getByRole("button", { name: /précédent/i })).toBeVisible()
  })

  test("parcours complet — redirige vers /auth/register ou /results", async ({ page }) => {
    // Q1 — origine
    await selectOption(page, "senegal")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q2 — niveau actuel
    await selectOption(page, "licence_3")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q3 — objectif
    await selectOption(page, "bourse")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q4 — domaine
    await selectOption(page, "sciences_tech")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q5 — pays cible (CountrySelectCard — attend le chargement)
    await expect(page.locator("select")).not.toBeDisabled({ timeout: 8000 })
    await page.locator("select").selectOption({ index: 1 })
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q6 — budget
    await selectOption(page, "zero")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q7 — diplôme
    await selectOption(page, "licence")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q8 — maturité dossier
    await selectOption(page, "en_cours")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q9 — blocage
    await selectOption(page, "information")
    await page.getByRole("button", { name: /suivant/i }).click()

    // Q10 — horizon
    await selectOption(page, "moyen")
    await page.getByRole("button", { name: /voir mes résultats/i }).click()

    // Nouveau flow : toujours redirigé vers /results (plus de redirect vers /auth/register)
    await expect(page).toHaveURL("/results", { timeout: 10_000 })
  }, { timeout: 60_000 })
})
