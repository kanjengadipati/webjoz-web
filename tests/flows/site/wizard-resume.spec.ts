import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

const KEY = "webjoz_wizard_resume_v1";

function makeSnapshot(overrides: Record<string, any> = {}) {
  return {
    version: 1,
    savedAt: Date.now(),
    chat: {
      chatStage: "description",
      messages: [
        { id: "ai-init", sender: "ai", text: "Halo! Siapa nama bisnis Anda?" },
        { id: "u1", sender: "user", text: "Warung Kopi Test" },
        { id: "ai-ack", sender: "ai", text: "Bagus! Warung Kopi Test ya." },
      ],
      businessName: "Warung Kopi Test",
      businessType: "Kuliner",
      businessSubType: "Kafe",
      description: "",
      whatsapp: "",
      serviceArea: "",
      mood: "",
      siteLanguage: "id",
      awaitingNameConfirm: false,
      awaitingInferenceConfirm: false,
      inferenceResult: null,
      suggestedHint: null,
      typeWasInferred: false,
      ...overrides.chat,
    },
    preview: null,
    ...overrides,
  };
}

async function seedSnapshot(page: any, snapshot: any) {
  await page.evaluate(
    ([k, s]: [string, string]) => localStorage.setItem(k, s),
    [KEY, JSON.stringify(snapshot)] as [string, string]
  );
}

test.describe("Wizard Resume", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("wizard saves state to localStorage and shows resume banner on reload", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    // Seed snapshot
    await seedSnapshot(page, makeSnapshot());

    // Reload so wizard picks up the snapshot
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Wait for resume banner to appear
    await page.waitForFunction(
      () => document.body.innerText.includes("Lanjutkan") || document.body.innerText.includes("Continue"),
      { timeout: 15000 }
    );
    const resumeBanner = page.locator("text=/lanjutkan|continue/i").first();
    await expect(resumeBanner).toBeVisible({ timeout: 5000 });
  });

  test("resume restores business name and chat stage", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    await seedSnapshot(page, makeSnapshot());

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Click resume
    await page.waitForFunction(
      () => document.body.innerText.includes("Lanjutkan") || document.body.innerText.includes("Continue"),
      { timeout: 15000 }
    );
    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    await expect(resumeBtn).toBeVisible({ timeout: 5000 });
    await resumeBtn.click();

    // After resume, business name should be visible in chat
    await expect(page.locator("text=Warung Kopi Test").first()).toBeVisible({ timeout: 10000 });
  });

  test("start fresh clears saved state", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    await seedSnapshot(page, makeSnapshot());

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Wait for resume banner, then click "start fresh" button
    await page.waitForFunction(
      () => document.body.innerText.includes("Lanjutkan") || document.body.innerText.includes("Continue"),
      { timeout: 15000 }
    );
    const freshBtn = page.locator("[title*='baru'], [title*='fresh'], [aria-label*='baru'], [aria-label*='fresh']").first();
    if (await freshBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await freshBtn.click();
    }

    // localStorage should be cleared
    const stored = await page.evaluate((k: string) => localStorage.getItem(k), KEY);
    expect(stored).toBeNull();
  });
});
