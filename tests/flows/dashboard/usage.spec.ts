import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Usage Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("usage page loads and displays quota meters", async ({ page }) => {
    await page.goto("/dashboard/usage");
    await page.waitForLoadState("networkidle");

    // Check page header and title
    await expect(page.locator("body")).toContainText(/penggunaan|usage|kuota/i);

    // Verify upgrade button exists
    const upgradeBtn = page.getByRole("link", { name: /upgrade/i }).first();
    await expect(upgradeBtn).toBeVisible();

    // Verify usage cards / meters exist
    await expect(page.locator("body")).toContainText(/website/i);
    await expect(page.locator("body")).toContainText(/ai generate|generasi ai/i);
  });

  test("usage page shows plan comparison table", async ({ page }) => {
    await page.goto("/dashboard/usage");
    await page.waitForLoadState("networkidle");

    // Check if comparison table or plan info is present
    await expect(page.locator("body")).toContainText(/free|pro|paket/i);
  });
});
