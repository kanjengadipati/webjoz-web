import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Social Login", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Google login button is visible on login page", async ({ page }) => {
    const googleBtn = page.getByRole("button", { name: /google/i });
    await expect(googleBtn).toBeVisible({ timeout: 5000 });
  });

  test("Facebook login button is NOT shown on login page (only signup)", async ({ page }) => {
    const fbBtn = page.getByRole("button", { name: /facebook/i });
    await expect(fbBtn).toBeHidden({ timeout: 3000 });
  });
});
