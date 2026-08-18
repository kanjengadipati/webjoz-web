import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Custom Domain Binding", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("domains page loads", async ({ domainsPage }) => {
    await domainsPage.goto();
    await expect(domainsPage.page.locator("body")).toContainText(/domain/i);
  });

  test("existing domains are listed", async ({ domainsPage }) => {
    await domainsPage.goto();
    await expect(domainsPage.page.locator("body")).toContainText(/mybusiness\.com|pending-domain/);
  });
});
