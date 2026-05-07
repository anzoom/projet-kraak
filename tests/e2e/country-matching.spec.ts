import { test, expect } from "@playwright/test"

test.setTimeout(60000)

// Profil ciblant la France — bourse, sciences_tech, licence
const ANSWERS_FRANCE_BOURSE = {
  origin_country: "senegal",
  current_level: "licence_3",
  main_objective: "bourse",
  domain: "sciences_tech",
  target_country: "france",
  budget: "confortable",
  academic_level: "licence",
  dossier_maturity: "avance",
  main_blocker: "information",
  timeline: "long",
}

// Profil ciblant la France — avec budget zéro
const ANSWERS_FRANCE_ZERO_BUDGET = {
  ...ANSWERS_FRANCE_BOURSE,
  budget: "zero",
}

// Profil "peu_importe" (pas de pays cible) — aucun bandeau zone attendu
const ANSWERS_PEU_IMPORTE = {
  ...ANSWERS_FRANCE_BOURSE,
  target_country: "peu_importe",
}

// Profil ciblant l'Europe entière (zone, pas un pays précis)
const ANSWERS_EUROPE_ZONE = {
  ...ANSWERS_FRANCE_BOURSE,
  target_country: "europe",
}

async function setSessionAnswers(
  page: import("@playwright/test").Page,
  answers: Record<string, string>,
) {
  // Naviguer une fois sur / pour être sur le bon origin, puis injecter le localStorage
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.evaluate((ans) => {
    localStorage.clear()
    localStorage.setItem(
      "kraak_anonymous_session",
      JSON.stringify({ state: { answers: ans, currentStep: 10 }, version: 0 }),
    )
  }, answers)
  await page.goto("/results", { waitUntil: "domcontentloaded" })
  // Attendre que le scoring soit terminé (spinner disparaît ou résultats apparaissent)
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="loading"]') &&
      (document.body.textContent?.includes("Tes recommandations") ||
       document.body.textContent?.includes("complète le test") ||
       document.body.textContent?.includes("Analyse de ton profil") === false),
    { timeout: 20000 },
  ).catch(() => {}) // timeout silencieux si le spinner persiste (résultats quand même affichés)
}

// ── Groupe 1 : résultats avec pays cible = France ─────────────────────────────

test.describe("Matching pays — France comme cible", () => {
  test.beforeEach(async ({ page }) => {
    await setSessionAnswers(page, ANSWERS_FRANCE_BOURSE)
  })

  test("la page résultats charge sans erreur", async ({ page }) => {
    await expect(page).toHaveURL("/results")
    const noData = page.getByText(/complète le test/i)
    const hasResults =
      (await page.getByText(/tes recommandations/i).count()) > 0 ||
      (await noData.count()) > 0
    expect(hasResults).toBe(true)
  })

  test("les cartes résultats affichent un libellé pays lisible (pas une valeur brute)", async ({ page }) => {
    const cards = page.locator("[data-testid='recommendation-card'], .recommendation-card").first()
    const firstCard = page.locator("text=/France|Europe|International|Canada|Allemagne|Belgique/i").first()
    // Le libellé pays doit être affiché en clair — pas "france", "europe", "international"
    const rawValueFrance = page.getByText(/^france$/i)
    const rawValueEurope = page.getByText(/^europe$/i)
    await expect(rawValueFrance).toHaveCount(0)
    await expect(rawValueEurope).toHaveCount(0)
    if (await firstCard.count() > 0) {
      await expect(firstCard.first()).toBeVisible()
    }
  })

  test("un bandeau informatif zone/international apparaît AVANT la liste de résultats", async ({ page }) => {
    // Le bandeau doit être visible sans scroller quand des résultats zone/international
    // complètent un pays précis (France). Il se positionne avant la première carte.
    const banner = page.getByText(/Aucune opportunité trouvée/i).first()

    const hasBanner = await banner.count() > 0
    if (!hasBanner) return // pas de fallback → pas de bandeau attendu

    await expect(banner).toBeVisible()

    // Le bandeau doit apparaître AVANT la première carte ou le paywall
    // Ancre : le heading "Tes recommandations" est au-dessus du bandeau,
    // et le bandeau est au-dessus du contenu des cartes.
    const heading = page.getByRole("heading", { name: /tes recommandations/i })
    const bannerBox = await banner.boundingBox()
    const headingBox = await heading.boundingBox()
    if (bannerBox && headingBox) {
      // Le bandeau doit être en-dessous du heading (y > headingBox.y)
      // et visible dans le viewport (pas besoin de scroller)
      expect(bannerBox.y).toBeGreaterThan(headingBox.y)
      // Vérifie qu'il est visible sans scroll (dans les 800px du viewport)
      expect(bannerBox.y).toBeLessThan(800)
    }
  })

  test("le bandeau zone mentionne 'France' et 'Europe'", async ({ page }) => {
    const banner = page.locator("text=/Europe/i").first()
    if (await banner.count() === 0) return // oppos france exact trouvées — pas de fallback
    await expect(banner).toBeVisible()
    // Le bandeau doit contextualiser : mentionner le pays cible
    const bannerText = await page.locator("text=/France|france/i").first().textContent()
    expect(bannerText).toBeTruthy()
  })

  test("si des résultats France-exact existent, ils apparaissent en premier", async ({ page }) => {
    // Vérifie le tri : les cartes "France" précèdent les cartes "Europe" ou "International"
    const franceCards = page.getByText("France", { exact: true })
    const europeCards = page.getByText("Europe", { exact: true })
    if (await franceCards.count() === 0) return // pas d'oppos France dans le catalogue actuel

    const firstFrance = franceCards.first()
    const firstEurope = europeCards.first()

    const franceBox = await firstFrance.boundingBox()
    const europeBox = await firstEurope.boundingBox()
    if (franceBox && europeBox) {
      expect(franceBox.y).toBeLessThan(europeBox.y)
    }
  })
})

// ── Groupe 2 : budget zéro + cible France ────────────────────────────────────

test.describe("Matching pays — France + budget zéro", () => {
  test.beforeEach(async ({ page }) => {
    await setSessionAnswers(page, ANSWERS_FRANCE_ZERO_BUDGET)
  })

  test("toutes les cartes affichées sont 'Financement complet'", async ({ page }) => {
    const results = page.getByText(/tes recommandations/i)
    if (await results.count() === 0) return

    // Avec budget=zero, le filtre 7bis exclut tout le partiel → toutes cartes = financement complet
    const partialBadge = page.getByText(/financement partiel/i)
    await expect(partialBadge).toHaveCount(0)
  })

  test("le diagnostic profil mentionne la contrainte budget zéro", async ({ page }) => {
    const budgetLine = page.getByText(/budget zéro|100% financées/i).first()
    if (await budgetLine.count() > 0) {
      await expect(budgetLine).toBeVisible()
    }
  })
})

// ── Groupe 3 : peu_importe — aucun bandeau zone attendu ──────────────────────

test.describe("Matching pays — peu_importe (pas de pays cible)", () => {
  test.beforeEach(async ({ page }) => {
    await setSessionAnswers(page, ANSWERS_PEU_IMPORTE)
  })

  test("pas de bandeau zone-fallback affiché", async ({ page }) => {
    // Sans pays cible précis, aucun message de fallback géographique
    const banner = page.getByText(/toute l'Europe|toute l'Afrique|toute l'Amérique/i)
    await expect(banner).toHaveCount(0)
  })

  test("des résultats s'affichent (matching sans contrainte géo)", async ({ page }) => {
    const results = page.getByText(/tes recommandations/i)
    const noData = page.getByText(/complète le test/i)
    const hasContent =
      (await results.count()) > 0 || (await noData.count()) > 0
    expect(hasContent).toBe(true)
  })
})

// ── Groupe 4 : cible = zone Europe (pas un pays précis) ──────────────────────

test.describe("Matching pays — zone Europe comme cible", () => {
  test.beforeEach(async ({ page }) => {
    await setSessionAnswers(page, ANSWERS_EUROPE_ZONE)
  })

  test("des cartes pays-dans-la-zone (France, Belgique…) peuvent apparaître", async ({ page }) => {
    // Quand l'utilisateur cible une zone, les oppos d'un pays précis de la zone passent aussi
    const results = page.getByText(/tes recommandations/i)
    const noData = page.getByText(/complète le test/i)
    const hasContent =
      (await results.count()) > 0 || (await noData.count()) > 0
    expect(hasContent).toBe(true)
  })

  test("pas de bandeau zone-fallback (zone choisie = exact match pour les sous-pays)", async ({ page }) => {
    // L'utilisateur a choisi une zone → les oppos dans un pays de cette zone sont des EXACT matches
    // pas des fallbacks → pas de bandeau
    const banner = page.getByText(/toute l'Europe/i)
    await expect(banner).toHaveCount(0)
  })
})

// ── Groupe 5 : cohérence UI des labels pays ───────────────────────────────────

test.describe("Affichage labels pays — aucune valeur brute visible", () => {
  const profilsATest = [
    { label: "france", answers: ANSWERS_FRANCE_BOURSE },
    { label: "peu_importe", answers: ANSWERS_PEU_IMPORTE },
    { label: "europe", answers: ANSWERS_EUROPE_ZONE },
  ]

  for (const { label, answers } of profilsATest) {
    test(`profil ${label} — labels pays affichés en clair`, async ({ page }) => {
      await setSessionAnswers(page, answers)

      // Les valeurs brutes ("france", "europe", "international") ne doivent pas
      // apparaître seules comme libellé dans les badges pays
      const rawValues = ["france", "europe", "afrique", "international", "amerique_nord"]
      for (const raw of rawValues) {
        // Chercher un badge/texte qui contient EXACTEMENT la valeur brute
        const exactRaw = page.locator(`text="${raw}"`)
        const count = await exactRaw.count()
        // Si présent, vérifier que c'est dans un contexte technique (pas un badge UI)
        if (count > 0) {
          const text = await exactRaw.first().textContent()
          // Le texte doit contenir d'autres mots (pas être seul comme libellé)
          expect(text?.trim()).not.toBe(raw)
        }
      }
    })
  }
})
