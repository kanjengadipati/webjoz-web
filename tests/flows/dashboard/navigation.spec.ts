import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

const DASHBOARD_PAGES = [
  { path: "/dashboard", name: "Overview" },
  { path: "/dashboard/sites", name: "Sites" },
  { path: "/dashboard/domains", name: "Domains" },
  { path: "/dashboard/leads", name: "Leads" },
  { path: "/dashboard/analytics", name: "Analytics" },
  { path: "/dashboard/upgrade", name: "Upgrade" },
  { path: "/dashboard/settings", name: "Settings" },
  { path: "/dashboard/team", name: "Team" },
  { path: "/dashboard/sessions", name: "Sessions" },
  { path: "/dashboard/notifications", name: "Notifications" },
];

test.describe("Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  for (const { path, name } of DASHBOARD_PAGES) {
    test(`${name} page (${path}) loads without crash`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("body")).not.toBeEmpty();
      await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    });
  }
});
