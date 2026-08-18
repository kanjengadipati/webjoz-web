import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Site Creation Wizard", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("wizard page loads", async ({ siteWizardPage }) => {
    await siteWizardPage.goto();
    await expect(siteWizardPage.page.locator("body")).toContainText(/create|wizard|buat|site/i);
  });
});
