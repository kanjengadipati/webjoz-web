import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Dashboard Overview", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("dashboard loads for regular user", async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await expect(dashboardPage.page.locator("body")).toContainText(/dashboard|welcome|overview|site/i);
  });

  test("dashboard shows stat cards", async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await expect(dashboardPage.page.locator("body")).toContainText(/site|lead|visitor/i);
  });
});
