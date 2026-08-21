import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Passwordless OTP Login", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await page.waitForLoadState("networkidle");
  });

  test("send OTP via email shows code input", async ({ loginPage, page }) => {
    await loginPage.switchToEmail.click();
    await loginPage.passwordlessEmail.fill("test@webjoz.com");
    await loginPage.submitButton.click();
    await expect(loginPage.otpCode).toBeVisible({ timeout: 5000 });
  });

  test("valid OTP verifies and shows success", async ({ loginPage, page }) => {
    await loginPage.switchToEmail.click();
    await loginPage.passwordlessEmail.fill("test@webjoz.com");
    await loginPage.submitButton.click();
    await expect(loginPage.otpCode).toBeVisible({ timeout: 5000 });

    await loginPage.otpCode.fill("123456");
    await page.getByRole("button", { name: /verif|otp/i }).click();

    await expect(page.locator("[role=status]")).toBeVisible({ timeout: 10000 });
  });

  test("invalid OTP shows error", async ({ loginPage, page }) => {
    await loginPage.switchToEmail.click();
    await loginPage.passwordlessEmail.fill("test@webjoz.com");
    await loginPage.submitButton.click();
    await expect(loginPage.otpCode).toBeVisible({ timeout: 5000 });

    await loginPage.otpCode.fill("000000");
    await page.getByRole("button", { name: /verif|otp/i }).click();

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });
});
