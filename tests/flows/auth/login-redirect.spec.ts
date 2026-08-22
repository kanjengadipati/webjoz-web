import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test("regular password login redirects to /dashboard after fix", async ({ page, loginPage }) => {
  mockAllRoutes(page);
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await loginPage.loginWithPassword("test-e2e@webjoz.com", "TestPassword123!");

  await page.waitForURL("/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL("/dashboard");
});

test("login clears stale redirect state", async ({ page }) => {
  mockAllRoutes(page);
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("webjoz_login_redirect", "/old-page");
    localStorage.setItem("webjoz_pending_wizard_data", "some-data");
  });

  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  const loginPage = new (await import("../../page-objects/auth/LoginPage")).LoginPage(page);
  await loginPage.loginWithPassword("test-e2e@webjoz.com", "TestPassword123!");

  await page.waitForURL("/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  const redirectVal = await page.evaluate(() => localStorage.getItem("webjoz_login_redirect"));
  const wizardVal = await page.evaluate(() => localStorage.getItem("webjoz_pending_wizard_data"));

  expect(redirectVal).toBeNull();
  expect(wizardVal).toBeNull();
});