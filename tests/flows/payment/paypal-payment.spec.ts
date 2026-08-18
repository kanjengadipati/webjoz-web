import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("PayPal Payment (USD)", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
    await page.route("**/paypal.com/sdk/js*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          window.paypal = {
            Buttons: function(opts) {
              return {
                render: function(selector) {
                  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
                  if (el) {
                    el.innerHTML = '<button data-testid="paypal-mock-btn" style="padding:10px 20px;background:#0070ba;color:white;border:none;border-radius:4px;cursor:pointer">Pay with PayPal</button>';
                    el.querySelector('[data-testid="paypal-mock-btn"]')?.addEventListener('click', async () => {
                      try {
                        const id = await opts.createOrder();
                        await opts.onApprove({ orderID: id });
                      } catch(e) { console.error(e); }
                    });
                  }
                }
              };
            }
          };
        `,
      });
    });
  });

  test("upgrade page loads with PayPal option visible", async ({ upgradePage }) => {
    await upgradePage.goto();
    await expect(upgradePage.page.locator("body")).toContainText(/paypal|usd/i);
  });
});
