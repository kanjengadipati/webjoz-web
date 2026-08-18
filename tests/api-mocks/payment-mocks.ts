import type { Page } from "@playwright/test";

export function mockPaymentRoutes(page: Page) {
  page.route("**/payments", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      const gateway = body?.gateway || "midtrans";
      if (gateway === "paypal") {
        await route.fulfill({
          status: 200,
          json: {
            status: "success",
            data: {
              id: 2, paypal_order_id: "mock-paypal-order-id",
              approval_url: "https://www.sandbox.paypal.com/checkoutnow?token=mock",
              status: "pending", gateway: "paypal", currency: "USD",
              plan_slug: "pro", billing_cycle: "monthly",
            },
          },
        });
      } else {
        await route.fulfill({
          status: 200,
          json: {
            status: "success",
            data: {
              id: 1, snap_token: "mock-snap-token-midtrans",
              snap_redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/abc",
              order_id: `ORDER-${Date.now()}`, gross_amount: body?.amount || 99000,
              status: "pending", gateway: "midtrans", currency: "IDR",
              plan_slug: "pro", billing_cycle: "monthly",
            },
          },
        });
      }
    } else {
      await route.fulfill({ status: 200, json: { status: "success", data: [] } });
    }
  });

  page.route("**/payments/*/capture-paypal", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { status: "completed", paypal_order_id: "mock-paypal-order-id" } },
    });
  });

  page.route("**/payments/notification", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "OK" } });
  });

  page.route("**/plans*", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        status: "success",
        data: [
          { id: 1, name: "Free", slug: "free", max_sites: 1, max_ai_generates: 2, max_section_regens: 5, max_design_regens: 2, max_members: 1, price_monthly_idr: 0, price_yearly_idr: 0, price_monthly_usd: 0, price_yearly_usd: 0 },
          { id: 2, name: "Pro", slug: "pro", max_sites: 5, max_ai_generates: 30, max_section_regens: 50, max_design_regens: 20, max_members: 5, price_monthly_idr: 99000, price_yearly_idr: 899000, price_monthly_usd: 9, price_yearly_usd: 89 },
          { id: 3, name: "Enterprise", slug: "enterprise", max_sites: -1, max_ai_generates: -1, max_section_regens: -1, max_design_regens: -1, max_members: -1, price_monthly_idr: 299000, price_yearly_idr: 2999000, price_monthly_usd: 29, price_yearly_usd: 299 },
        ],
      },
    });
  });
}
