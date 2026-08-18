import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";
import { TEST_DATA } from "../../fixtures/test-data";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.evaluate(() => localStorage.clear());
  });

  test("register page loads with form fields", async ({ registerPage }) => {
    await registerPage.goto();
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test("register with valid data redirects to login", async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.fillForm({
      name: "New User",
      email: `new-${Date.now()}@test.com`,
      phone: "+6281234567890",
      password: "SecurePass123!",
    });
    await registerPage.submit();
    await page.waitForURL(/login/, { timeout: 10000 });
  });

  test("register with duplicate email shows error", async ({ registerPage, page }) => {
    await page.route("**/auth/register", (route) =>
      route.fulfill({ status: 409, json: { status: "error", message: "Email already registered" } })
    );
    await registerPage.goto();
    await registerPage.fillForm({
      name: "Dup User",
      email: TEST_DATA.user.email,
      password: "Pass123!",
    });
    await registerPage.submit();
    await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 });
  });
});
