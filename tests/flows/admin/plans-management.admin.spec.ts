import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Admin - Plans Management", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("admin plans page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/plans");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/plan|free|pro/i);
  });
});
