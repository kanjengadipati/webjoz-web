import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Social Login", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.evaluate(() => localStorage.clear());
    await page.addInitScript(() => {
      (window as any).google = {
        accounts: {
          id: {
            initialize: () => {},
            prompt: () => {},
            renderButton: () => {},
          },
        },
      };
    });
  });

  test("Google login button is visible", async ({ loginPage }) => {
    await loginPage.goto();
    const googleBtn = loginPage.page.getByRole("button", { name: /google/i });
    await expect(googleBtn).toBeVisible({ timeout: 5000 });
  });

  test("Facebook login button is visible", async ({ loginPage }) => {
    await loginPage.goto();
    const fbBtn = loginPage.page.getByRole("button", { name: /facebook/i });
    await expect(fbBtn).toBeVisible({ timeout: 5000 });
  });
});
