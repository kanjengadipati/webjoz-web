import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Passwordless OTP Login", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.evaluate(() => localStorage.clear());
  });

  test("send OTP via email shows code input", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.switchToEmail.click();
    await loginPage.passwordlessEmail.fill("test@webjoz.com");
    await loginPage.submitButton.click();
    await expect(loginPage.otpCode).toBeVisible({ timeout: 5000 });
  });

  test("valid OTP verifies and redirects", async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginWithOTP("email", "test@webjoz.com", "123456");
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  });

  test("invalid OTP shows error", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginWithOTP("email", "test@webjoz.com", "000000");
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });
});
