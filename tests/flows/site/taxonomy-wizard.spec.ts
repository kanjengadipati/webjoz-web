import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Taxonomy Wizard Integration & Fallback Guard", () => {
  test("shows category chips from fallback when taxonomy endpoint fails", async ({ page, siteWizardPage }) => {
    mockAllRoutes(page);

    // Force taxonomy endpoint to fail
    await page.route("**/ai/public/taxonomy*", async (route) => {
      await route.fulfill({ status: 500, json: { status: "error", message: "Server down" } });
    });

    await siteWizardPage.goto();

    // Fill business name
    const input = page.locator("input[type=text]").first();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("Kedai Kopi Kita");
    await input.press("Enter");

    // Skip description to enter category selection stage
    const descInput = page.locator("input[type=text]").first();
    await expect(descInput).toBeVisible({ timeout: 5000 });
    await descInput.fill("lewat");
    await descInput.press("Enter");

    // Category chips must still be rendered from fallback
    const kulinerChip = page.getByRole("button", { name: /Kuliner/i }).first();
    await expect(kulinerChip).toBeVisible({ timeout: 8000 });

    const tokoChip = page.getByRole("button", { name: /Toko/i }).first();
    await expect(tokoChip).toBeVisible();

    // Clicking Kuliner chip should show sub-type chips
    await kulinerChip.click();
    const kafeChip = page.getByRole("button", { name: /Kafe/i }).first();
    await expect(kafeChip).toBeVisible({ timeout: 5000 });
  });

  test("uses taxonomy API values when endpoint succeeds", async ({ page, siteWizardPage }) => {
    mockAllRoutes(page);

    await page.route("**/ai/public/taxonomy*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: {
            version: 1,
            lang: "id",
            types: [
              {
                id: "food",
                value: "Kuliner",
                label: "Kuliner",
                description: "bisnis makanan/minuman",
                sub_types: [
                  { id: "food.cafe", value: "Kafe", label: "Kafe", regions: [] },
                ],
              },
            ],
          },
        },
      });
    });

    await siteWizardPage.goto();

    const input = page.locator("input[type=text]").first();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("Kopi Santai");
    await input.press("Enter");

    const descInput = page.locator("input[type=text]").first();
    await expect(descInput).toBeVisible({ timeout: 5000 });
    await descInput.fill("lewat");
    await descInput.press("Enter");

    const kulinerChip = page.getByRole("button", { name: /Kuliner/i }).first();
    await expect(kulinerChip).toBeVisible({ timeout: 8000 });
  });
});

