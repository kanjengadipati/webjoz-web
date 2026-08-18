import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Admin - Templates Management", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("admin templates page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/templates");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/template|kuliner|jasa|produk/i);
  });
});
