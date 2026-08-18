import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Team Management", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("team page loads", async ({ teamPage }) => {
    await teamPage.goto();
    await expect(teamPage.page.locator("body")).toContainText(/team|member|undang/i);
  });
});
