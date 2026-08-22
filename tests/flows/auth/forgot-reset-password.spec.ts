import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Forgot/Reset Password", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/login");
  });

  test("forgot password page loads", async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();
    await expect(forgotPasswordPage.emailInput).toBeVisible();
    await expect(forgotPasswordPage.submitButton).toBeVisible();
  });

  test("submit email shows success message", async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitEmail("test@webjoz.com");
    await expect(forgotPasswordPage.successMessage).toBeVisible({ timeout: 5000 });
  });

  test("invalid email shows error", async ({ forgotPasswordPage, page }) => {
    await page.route("**/auth/forgot-password", (route) =>
      route.fulfill({ status: 404, json: { status: "error", message: "Email not found" } })
    );
    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitEmail("nonexistent@test.com");
    await expect(forgotPasswordPage.errorMessage).toBeVisible({ timeout: 5000 });
  });
});
