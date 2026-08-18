import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Site Editor", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("site editor page loads for existing site", async ({ siteEditorPage }) => {
    await siteEditorPage.goto(1);
    await expect(siteEditorPage.page.locator("body")).toContainText(/site|editor|content/i);
  });
});
