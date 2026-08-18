import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Midtrans Payment (IDR)", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.addInitScript(() => {
      (window as any).snap = {
        pay: (token: string, options: any) => {
          setTimeout(() => options?.onSuccess?.({ status: "settlement", payment_type: "bank_transfer", order_id: "MOCK-ORDER" }), 500);
        },
      };
    });
  });

  test("upgrade page loads with plan cards", async ({ upgradePage }) => {
    await upgradePage.goto();
    await expect(upgradePage.page.locator("body")).toContainText(/pro|enterprise|plan/i);
  });

  test("Midtrans gateway option is available", async ({ upgradePage }) => {
    await upgradePage.goto();
    await expect(upgradePage.page.locator("body")).toContainText(/midtrans|idr/i);
  });
});
