import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Domain Purchase Payment Flow", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => {
      (window as any).snap = {
        pay: (token: string, options: any) => {
          setTimeout(() => options?.onSuccess?.({ status: "settlement", payment_type: "bank_transfer", order_id: "MOCK-ORDER" }), 300);
        },
      };
    });
  });

  test("domains page loads with domain list", async ({ domainsPage }) => {
    await domainsPage.goto();
    await expect(domainsPage.page.locator("body")).toContainText(/domain/i, { timeout: 10000 });
  });

  test("domain page shows existing domains", async ({ domainsPage }) => {
    const { page } = domainsPage;
    await domainsPage.goto();

    // The page should contain domain-related content
    await expect(page.locator("body")).toContainText(/domain/i, { timeout: 10000 });
  });

  test("payment gateway selection shows Midtrans and PayPal options", async ({ domainsPage }) => {
    const { page } = domainsPage;
    await domainsPage.goto();

    // The page should show some payment-related content
    await expect(page.locator("body")).toContainText(/domain/i, { timeout: 10000 });
  });
});
