import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Site Publishing", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("publish button is available on site editor", async ({ siteEditorPage }) => {
    await siteEditorPage.goto(1);
    await expect(siteEditorPage.page.locator("body")).toContainText(/publish|draft|status/i);
  });
});
