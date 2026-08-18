import type { Page } from "@playwright/test";

export function mockDomainRoutes(page: Page) {
  page.route("**/domains", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: [
            { id: 1, domain: "mybusiness.com", site_id: 1, status: "verified", type: "custom", verified_at: new Date().toISOString() },
            { id: 2, domain: "pending-domain.net", site_id: 1, status: "pending", type: "custom" },
          ],
        },
      });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", data: { id: 3, domain: "new-domain.com", status: "pending" } } });
    }
  });

  page.route("**/domains/*/verify", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { status: "verified" } } });
  });

  page.route("**/domains/*", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 200, json: { status: "success", message: "Domain deleted" } });
    }
  });

  page.route("**/domain-purchases/search", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        status: "success",
        data: { domain: "mynewsite.com", status: "available", currency: "USD", wholesale_price_usd: 12.5, sell_price_idr: 200000 },
      },
    });
  });

  page.route("**/domain-purchases", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: { id: 4, domain_name: "mynewsite.com", sell_price_idr: 200000, expires_at: "2027-08-17T00:00:00Z", status: "active", years: 1 },
        },
      });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", data: [] } });
    }
  });
}
