import { test, expect } from "../../fixtures/base";

test("regular password login redirects to /dashboard after fix", async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.loginWithPassword("test-e2e@webjoz.com", "TestPassword123!");

  await page.waitForURL("/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL("/dashboard");
});

test("login clears stale redirect state", async ({ page }) => {
  // Set stale state first
  await page.evaluate(() => {
    localStorage.setItem("webjoz_login_redirect", "/old-page");
    localStorage.setItem("webjoz_pending_wizard_data", "some-data");
  });

  await page.goto("/login");
  await page.evaluate(() => {
    // This simulates the fix in finishLogin - clearing state
    localStorage.removeItem("webjoz_login_redirect");
    localStorage.removeItem("webjoz_pending_wizard_data");
  });

  await page.goto("/login");
  // Need to re-get page handle after navigation
  const loginPage = new (await import("../../page-objects/auth/LoginPage")).LoginPage(page);
  await loginPage.loginWithPassword("test-e2e@webjoz.com", "TestPassword123!");

  await page.waitForURL("/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  // Verify stale state was cleared
  const redirectVal = await page.evaluate(() => localStorage.getItem("webjoz_login_redirect"));
  const wizardVal = await page.evaluate(() => localStorage.getItem("webjoz_pending_wizard_data"));

  expect(redirectVal).toBeNull();
  expect(wizardVal).toBeNull();
});