import { test, expect } from "@playwright/test"

test.setTimeout(90000)

const TEST_EMAIL = "test@kraak.app"
const TEST_PASSWORD = "TestKraak2026"
const CRON_SECRET = "kraak-cron-dev-secret-2026"

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

async function login(page: import("@playwright/test").Page) {
  await page.goto("/auth/login", { waitUntil: "load", timeout: 30000 })
  await page.locator("#email").pressSequentially(TEST_EMAIL)
  await page.fill("#password", TEST_PASSWORD)
  await page.click('[type="submit"]')
  await page.waitForURL("/results", { timeout: 30000 })
}

// ── 7.3 ────────────────────────────────────────────────────────────────────────

test("7.3 — save-test-response est appelé en fire-and-forget sur /results authentifié", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await setAnswers(page)
  await page.goto("/auth/login", { waitUntil: "load", timeout: 30000 })
  await page.locator("#email").pressSequentially(TEST_EMAIL)
  await page.fill("#password", TEST_PASSWORD)

  // Créer le listener juste avant le clic pour éviter les faux timeouts
  const requestPromise = page.waitForRequest(
    (req) =>
      req.url().includes("/api/user/save-test-response") && req.method() === "POST",
    { timeout: 40000 },
  )

  await page.click('[type="submit"]')
  await page.waitForURL("/results", { timeout: 30000 })

  const req = await requestPromise
  const body = JSON.parse(req.postData() ?? "{}")
  expect(typeof body.answers).toBe("object")
  expect(Object.keys(body.answers).length).toBeGreaterThan(0)
})

// ── 7.4 ────────────────────────────────────────────────────────────────────────

test("7.4 — toggle alertes visible dans /dashboard, désactivé sans Guide Premium", async ({ page }) => {
  await login(page)
  await setAnswers(page)

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" })

  const toggle = page.locator('[aria-label="Toggle alertes email"]')
  await expect(toggle).toBeVisible({ timeout: 10000 })

  // En phase MVP (isPremium = false), le toggle est désactivé sans accès Guide Premium
  await expect(toggle).toBeDisabled({ timeout: 5000 })
})

// ── 7.5 ────────────────────────────────────────────────────────────────────────

test("7.5 — GET /api/cron/send-alerts retourne { sent, skipped } avec le bon secret", async ({ page }) => {
  await page.goto("/")

  const result = await page.evaluate(async (secret: string) => {
    const res = await fetch("/api/cron/send-alerts", {
      headers: { Authorization: `Bearer ${secret}` },
    })
    const text = await res.text()
    return { status: res.status, text }
  }, CRON_SECRET)

  expect(result.status).toBe(200)
  const body = JSON.parse(result.text) as { sent: number; skipped: number; error?: string }
  expect(typeof body.sent).toBe("number")
  expect(typeof body.skipped).toBe("number")
})

test("7.5 — GET /api/cron/send-alerts retourne 401 sans secret", async ({ page }) => {
  await page.goto("/")

  const result = await page.evaluate(async () => {
    const res = await fetch("/api/cron/send-alerts")
    return { status: res.status }
  })

  expect(result.status).toBe(401)
})
