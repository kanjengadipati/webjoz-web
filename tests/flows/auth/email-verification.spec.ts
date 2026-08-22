import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Email Verification", () => {
  test("verify with valid token shows success", async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`/verify?token=${"mock-verify-token-xyz789"}`);
    await expect(page.locator("body")).toContainText(/verified|success|berhasil/i, { timeout: 10000 });
  });

  test("verify with invalid token shows error", async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/verify?token=invalid-token");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[class*=rose-500]")).toBeVisible({ timeout: 10000 });
  });
});
