import type { Page } from "@playwright/test";

export function mockAdminRoutes(page: Page) {
  page.route("**/tenants/admin/stats", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { total_tenants: 150, total_users: 300, total_sites: 200, new_tenants_7d: 12, new_users_7d: 25 } },
    });
  });

  page.route("**/tenants/admin", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        status: "success",
        data: [
          { id: 1, name: "Tenant Alpha", slug: "alpha", plan: "pro", owner_id: 1, member_count: 3, site_count: 2, created_at: new Date().toISOString() },
        ],
      },
    });
  });

  page.route("**/health/system", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { database: "ok", cache: "ok", ai: "ok", version: "0.1.1" } },
    });
  });

  page.route("**/admin/plans", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        status: "success",
        data: [
          { id: 1, name: "Free", slug: "free", price_monthly_idr: 0, price_yearly_idr: 0, is_active: true },
          { id: 2, name: "Pro", slug: "pro", price_monthly_idr: 99000, price_yearly_idr: 899000, is_active: true },
        ],
      },
    });
  });

  page.route("**/admin/announcements", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: { status: "success", data: [{ id: 1, title: "System Maintenance", body: "Scheduled downtime", is_active: true, created_at: new Date().toISOString() }] },
      });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", message: "Announcement created" } });
    }
  });

  page.route("**/notifications", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { unread_count: 3, items: [{ id: 1, title: "Welcome!", read: false }] } },
    });
  });

  page.route("**/leads*", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });

  page.route("**/analytics*", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { total_pageviews: 1234, pageviews_by_date: [] } },
    });
  });

  page.route("**/tenants/*/usage", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { usage: { generate_count: 2, section_regen_count: 1, design_regen_count: 0 }, max_ai_generates: 30, max_section_regens: 50, max_design_regens: 20 } },
    });
  });
}
