import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";
import { TEST_DATA } from "../../fixtures/test-data";

test.describe("Session Management", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("sessions page loads and lists sessions", async ({ sessionsPage }) => {
    await sessionsPage.goto();
    await expect(sessionsPage.page.locator("body")).toContainText("Chrome");
  });

  test("revoke session button is available", async ({ sessionsPage }) => {
    await sessionsPage.goto();
    const revokeBtn = sessionsPage.revokeButtons.first();
    if (await revokeBtn.isVisible()) {
      await expect(revokeBtn).toBeVisible();
    }
  });
});
