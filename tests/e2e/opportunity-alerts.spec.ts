import { test, expect } from "@playwright/test"

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
  await page.goto("/auth/login")
  await page.fill("#email", TEST_EMAIL)
  await page.fill("#password", TEST_PASSWORD)
  await page.click('[type="submit"]')
  await page.waitForURL("/results", { timeout: 20000 })
}

// ── 7.3 ────────────────────────────────────────────────────────────────────────

test("7.3 — save-test-response est appelé en fire-and-forget sur /results authentifié", async ({ page }) => {
  await page.goto("/")
  await setAnswers(page)

  const requestPromise = page.waitForRequest(
    (req) =>
      req.url().includes("/api/user/save-test-response") && req.method() === "POST",
    { timeout: 20000 },
  )

  await login(page)

  const req = await requestPromise
  const body = JSON.parse(req.postData() ?? "{}")
  expect(typeof body.answers).toBe("object")
  expect(Object.keys(body.answers).length).toBeGreaterThan(0)
})

// ── 7.4 ────────────────────────────────────────────────────────────────────────

test("7.4 — toggle alertes dans /dashboard bascule alerts_enabled en DB", async ({ page }) => {
  await page.goto("/")
  await setAnswers(page)
  await login(page)

  await page.goto("/dashboard")

  const toggle = page.locator('[aria-label="Toggle alertes email"]')
  await expect(toggle).toBeVisible({ timeout: 10000 })

  const initialState = await page.evaluate(async () => {
    const res = await fetch("/api/user/alerts")
    return (await res.json()) as { alerts_enabled: boolean }
  })

  // Cliquer et attendre que le toggle se re-active (savingAlerts redevient false)
  await toggle.click()
  await expect(toggle).toBeEnabled({ timeout: 10000 })

  const newState = await page.evaluate(async () => {
    const res = await fetch("/api/user/alerts")
    return (await res.json()) as { alerts_enabled: boolean }
  })
  expect(newState.alerts_enabled).toBe(!initialState.alerts_enabled)

  // Remettre l'état initial
  await toggle.click()
  await expect(toggle).toBeEnabled({ timeout: 10000 })

  const restored = await page.evaluate(async () => {
    const res = await fetch("/api/user/alerts")
    return (await res.json()) as { alerts_enabled: boolean }
  })
  expect(restored.alerts_enabled).toBe(initialState.alerts_enabled)
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
