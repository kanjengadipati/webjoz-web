import type { Page } from "@playwright/test";

export function mockTenantRoutes(page: Page) {
  page.route("**/tenants/me", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        status: "success",
        data: [
          { tenant: { id: 1, name: "Workspace Utama", slug: "workspace-1", plan: "pro", owner_id: 1, member_count: 3, site_count: 2 }, role: "owner" },
          { tenant: { id: 2, name: "Client Workspace", slug: "client-ws", plan: "free", owner_id: 2, member_count: 1, site_count: 0 }, role: "member" },
        ],
      },
    });
  });

  page.route("**/tenants", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { status: "success", data: { id: 3, name: body?.name, slug: body?.slug } } });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", data: [] } });
    }
  });

  page.route("**/tenants/*/members", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: [
            { user_id: 1, name: "Test User", email: "test-e2e@webjoz.com", role: "owner", joined_at: new Date().toISOString() },
            { user_id: 2, name: "Team Member", email: "member@webjoz.com", role: "editor", joined_at: new Date().toISOString() },
          ],
        },
      });
    }
  });

  page.route("**/tenants/*/invitations", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 200, json: { status: "success", message: "Invitation sent" } });
    } else {
      await route.fulfill({
        status: 200,
        json: { status: "success", data: [{ id: 1, email: "invite1@test.com", role: "editor", status: "pending", sent_at: new Date().toISOString() }] },
      });
    }
  });

  page.route("**/permissions*", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { permissions: ["site:view", "site:edit", "domain:manage", "lead:read", "analytics:read"] } },
    });
  });
}
