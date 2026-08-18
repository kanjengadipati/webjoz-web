import type { Page } from "@playwright/test";
import { mockAuthRoutes } from "./auth-mocks";
import { mockSiteRoutes } from "./site-mocks";
import { mockPaymentRoutes } from "./payment-mocks";
import { mockDomainRoutes } from "./domain-mocks";
import { mockTenantRoutes } from "./tenant-mocks";
import { mockAdminRoutes } from "./admin-mocks";

export function mockAllRoutes(page: Page) {
  mockAuthRoutes(page);
  mockSiteRoutes(page);
  mockPaymentRoutes(page);
  mockDomainRoutes(page);
  mockTenantRoutes(page);
  mockAdminRoutes(page);

  // Catch-all: prevent any unmocked API call from hanging
  page.route("**/auth/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/sites/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/tenants/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/admin/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/plans/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/payments/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/domains/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/leads/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/analytics/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { total_pageviews: 0, pageviews_by_date: [] } } });
  });
  page.route("**/notifications/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { unread_count: 0, items: [] } } });
  });
  page.route("**/health/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { database: "ok", cache: "ok", ai: "ok", version: "0.1.0" } } });
  });
  page.route("**/permissions/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { permissions: [], role: "user" } } });
  });
  page.route("**/ai/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/commissions/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { summary: { total_earned: 0, total_pending: 0, total_voided: 0 }, items: [] } } });
  });
  page.route("**/bonuses/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { summary: { total_earned: 0, total_pending: 0, total_voided: 0, total_paid: 0, onboarding_count: 0, milestone_count: 0 }, items: [] } } });
  });
  page.route("**/referral/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { referral_code: "E2ETEST" } } });
  });
  page.route("**/users/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/roles/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/invitations/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/blog/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/testimoni/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/domain-purchases/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/platform-config/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/audit/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/social/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/tokens/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
  page.route("**/public/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: [] } });
  });
  page.route("**/debug/**", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: {} } });
  });
}
