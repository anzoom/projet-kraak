import { test, expect } from "@playwright/test"

test.describe("Authentification — Connexion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "load", timeout: 30000 })
  })

  test("affiche le formulaire de connexion", async ({ page }) => {
    const form = page.locator("form")
    await expect(page.getByRole("heading", { name: /connexion/i }).first()).toBeVisible()
    await expect(form.getByLabel(/email/i)).toBeVisible()
    await expect(form.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(form.getByRole("button", { name: /se connecter/i })).toBeVisible()
  })

  test("affiche une erreur sur identifiants incorrects", async ({ page }) => {
    const form = page.locator("form")
    const submitBtn = form.getByRole("button", { name: /se connecter/i })
    // Attendre que React hydrate le formulaire avant d'interagir
    await expect(submitBtn).toBeEnabled({ timeout: 15000 })
    await page.locator("#email").pressSequentially("invalide@test.com")
    await page.fill("#password", "wrongpassword123")
    await submitBtn.click()
    await expect(page.getByText(/incorrect|invalide|email ou mot de passe/i)).toBeVisible({ timeout: 15000 })
  })

  test("lien vers inscription visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /créer un compte/i })).toBeVisible()
  })

  test("lien mot de passe oublié visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /oublié|mot de passe/i })).toBeVisible()
  })
})

test.describe("Authentification — Inscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/register", { waitUntil: "load", timeout: 30000 })
  })

  test("affiche le formulaire d'inscription", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /créer|inscription|compte/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i).first()).toBeVisible()
  })

  test("lien vers connexion visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /connexion|se connecter/i })).toBeVisible()
  })
})

test.describe("Authentification — Mot de passe oublié", () => {
  test("affiche le formulaire de réinitialisation", async ({ page }) => {
    await page.goto("/auth/forgot-password")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /envoyer|réinitialiser/i })).toBeVisible()
  })
})
