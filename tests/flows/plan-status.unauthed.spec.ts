import { test, expect } from "@playwright/test";
import { isTenantSuspended } from "../../lib/plan-status";

// Pure unit tests for the shared suspension rule that mirrors the backend
// PlanExpired(): cron marker set, or paid deadline already passed.
test.describe("isTenantSuspended", () => {
  const now = Date.UTC(2026, 9, 7, 12, 0, 0);
  const past = new Date(now - 60_000).toISOString();
  const future = new Date(now + 86_400_000).toISOString();

  test("cron marker set => suspended", () => {
    expect(isTenantSuspended({ plan: "free", plan_expired_at: past }, now)).toBe(true);
  });

  test("paid deadline passed before cron runs => suspended", () => {
    expect(isTenantSuspended({ plan: "pro", plan_expires_at: past }, now)).toBe(true);
  });

  test("active paid plan => not suspended", () => {
    expect(isTenantSuspended({ plan: "pro", plan_expires_at: future }, now)).toBe(false);
  });

  test("free plan with a stale deadline => not suspended", () => {
    expect(isTenantSuspended({ plan: "free", plan_expires_at: past }, now)).toBe(false);
  });

  test("clock not mounted yet (SSR) => not suspended", () => {
    expect(isTenantSuspended({ plan: "pro", plan_expires_at: past }, null)).toBe(false);
  });

  test("missing tenant => not suspended", () => {
    expect(isTenantSuspended(undefined, now)).toBe(false);
  });
});