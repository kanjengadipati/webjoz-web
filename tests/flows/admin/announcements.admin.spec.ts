import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Admin - Announcements", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("admin announcements page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/announcements");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/announcement|maintenance|system/i);
  });
});
