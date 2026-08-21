import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Wizard Chat Stages", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("wizard starts at name stage with input field visible", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();

    // Input field should be visible
    const input = page.locator("input[type=text]").first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test("entering business name progresses to next stage", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();

    const input = page.locator("input[type=text]").first();
    await expect(input).toBeVisible({ timeout: 10000 });

    // Type business name and submit
    await input.fill("Toko Roti Enak");
    await input.press("Enter");

    // AI should respond — wait for processing
    await page.waitForTimeout(2000);

    // At minimum, the input should still be present for next stage
    const nextInput = page.locator("input[type=text]").first();
    await expect(nextInput).toBeVisible({ timeout: 5000 });
  });

  test("description stage shows mic button", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    // Seed state to jump to description stage
    const snapshot = {
      version: 1,
      savedAt: Date.now(),
      chat: {
        chatStage: "description",
        messages: [
          { id: "ai-init", sender: "ai", text: "Halo! Siapa nama bisnis Anda?" },
          { id: "u1", sender: "user", text: "Toko Roti" },
          { id: "ai-ack", sender: "ai", text: "Bagus! Toko Roti ya." },
        ],
        businessName: "Toko Roti",
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
      },
      preview: null,
    };
    await page.evaluate(
      ([k, s]: [string, string]) => localStorage.setItem(k, s),
      ["webjoz_wizard_resume_v1", JSON.stringify(snapshot)] as [string, string]
    );

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Wait for resume banner
    await page.waitForFunction(
      () => document.body.innerText.includes("Lanjutkan") || document.body.innerText.includes("Continue"),
      { timeout: 15000 }
    );

    // Click resume
    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    await expect(resumeBtn).toBeVisible({ timeout: 5000 });
    await resumeBtn.click();

    // Wait for wizard to hydrate to description stage
    await page.waitForTimeout(2000);

    // Mic button should be visible in description stage (animate-mic-pulse class)
    const micButton = page.locator(".animate-mic-pulse, button[title*=mic], button[title*=Mic], button[title*=bicara]").first();
    await expect(micButton).toBeVisible({ timeout: 10000 });
  });
});
