import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Admin - Health & Metrics", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("admin health page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/health");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/health|database|cache|ok/i);
  });

  test("admin dashboard shows platform stats", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/150|300|200|tenant|user/i);
  });
});
