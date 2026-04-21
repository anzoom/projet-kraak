import { test, expect } from "@playwright/test"

test.describe("Authentification — Connexion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login")
  })

  test("affiche le formulaire de connexion", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible()
  })

  test("affiche une erreur sur identifiants incorrects", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalide@test.com")
    await page.getByLabel(/mot de passe/i).fill("wrongpassword123")
    await page.getByRole("button", { name: /se connecter/i }).click()
    await expect(page.getByText(/incorrect|invalide|email ou mot de passe/i)).toBeVisible({ timeout: 8000 })
  })

  test("lien vers inscription visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /créer un compte|inscription|s'inscrire/i })).toBeVisible()
  })

  test("lien mot de passe oublié visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /oublié|mot de passe/i })).toBeVisible()
  })
})

test.describe("Authentification — Inscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/register")
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
