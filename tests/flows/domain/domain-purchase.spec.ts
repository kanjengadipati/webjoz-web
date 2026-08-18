import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Domain Purchase", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("domains page loads with search functionality", async ({ domainsPage }) => {
    await domainsPage.goto();
    await expect(domainsPage.page.locator("body")).toContainText(/domain/i);
  });
});
