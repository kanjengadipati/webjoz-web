import type { Page, Route, Request } from "@playwright/test";
import { mockAuthRoutes } from "./auth-mocks";
import { mockSiteRoutes } from "./site-mocks";
import { mockPaymentRoutes } from "./payment-mocks";
import { mockDomainRoutes } from "./domain-mocks";
import { mockTenantRoutes } from "./tenant-mocks";
import { mockAdminRoutes } from "./admin-mocks";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function isApiRequest(request: Request): boolean {
  const url = request.url();
  return url.startsWith(API_BASE) || url.startsWith("http://localhost:8080") || url.startsWith("http://127.0.0.1:8080");
}

function apiRoute(page: Page, pattern: string, handler: (route: Route) => Promise<void>) {
  page.route(pattern, async (route) => {
    if (!isApiRequest(route.request())) {
      await route.fallback();
      return;
    }
    await handler(route);
  });
}

export function mockAllRoutes(page: Page) {
  // Catch-all first — specific mocks override these (Playwright uses last-registered handler)
  apiRoute(page, "**/auth/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/sites/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/tenants/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/admin/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/payments/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/domains/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/leads/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/analytics/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { total_pageviews: 0, pageviews_by_date: [] } } });
  });
  apiRoute(page, "**/notifications/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { unread_count: 0, items: [] } } });
  });
  apiRoute(page, "**/health/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { database: "ok", cache: "ok", ai: "ok", version: "0.1.0" } } });
  });
  apiRoute(page, "**/permissions/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { permissions: [], role: "user" } } });
  });
  apiRoute(page, "**/ai/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/commissions/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { summary: { total_earned: 0, total_pending: 0, total_voided: 0 }, items: [] } } });
  });
  apiRoute(page, "**/bonuses/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { summary: { total_earned: 0, total_pending: 0, total_voided: 0, total_paid: 0, onboarding_count: 0, milestone_count: 0 }, items: [] } } });
  });
  apiRoute(page, "**/referral/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { referral_code: "E2ETEST" } } });
  });
  apiRoute(page, "**/users/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/roles/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/invitations/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/blog/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/testimoni/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/domain-purchases/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/platform-config/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/audit/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/social/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/tokens/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  apiRoute(page, "**/public/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  apiRoute(page, "**/debug/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });

  // Specific mocks — registered last, so they override the catch-alls
  mockAuthRoutes(page);
  mockSiteRoutes(page);
  mockPaymentRoutes(page);
  mockDomainRoutes(page);
  mockTenantRoutes(page);
  mockAdminRoutes(page);
}
