import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Password Login", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.evaluate(() => localStorage.clear());
  });

  test("login page loads with auth method options", async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.switchToPassword).toBeVisible({ timeout: 10000 });
    await expect(loginPage.switchToWhatsApp).toBeVisible();
  });

  test("successful password login redirects to dashboard", async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginWithPassword("test-e2e@webjoz.com", "TestPassword123!");
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  });

  test("invalid credentials shows error", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginWithPassword("wrong@test.com", "badpassword");
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("switch between auth methods works", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.switchToPassword.click();
    await expect(loginPage.loginEmail).toBeVisible();
    await expect(loginPage.loginPassword).toBeVisible();
  });
});
