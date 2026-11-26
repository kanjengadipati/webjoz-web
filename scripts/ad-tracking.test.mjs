import test from "node:test";
import assert from "node:assert/strict";
import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttributionParams,
  getStoredAttribution,
  parseAttributionFromSearch,
} from "../lib/ad-tracking.ts";

test("parseAttributionFromSearch extracts UTM params and click IDs", () => {
  const parsed = parseAttributionFromSearch(
    "?utm_source=meta&utm_medium=paid_social&utm_campaign=umkm_q4&fbclid=IwAR12345",
    "/create"
  );
  assert.ok(parsed);
  assert.equal(parsed.utm_source, "meta");
  assert.equal(parsed.utm_medium, "paid_social");
  assert.equal(parsed.utm_campaign, "umkm_q4");
  assert.equal(parsed.fbclid, "IwAR12345");
  assert.equal(parsed.landing_path, "/create");
});

test("parseAttributionFromSearch returns null when no tracking params exist", () => {
  assert.equal(parseAttributionFromSearch(""), null);
  assert.equal(parseAttributionFromSearch("?businessType=cafe&dt=abc"), null);
});

test("captureAttributionParams persists to localStorage and preserves on clean URL", () => {
  const store = new Map();
  const prevWindow = globalThis.window;
  globalThis.window = {
    location: { search: "", pathname: "/create" },
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
    },
  };

  try {
    const first = captureAttributionParams("?utm_source=instagram&utm_campaign=promo1&fbclid=fb99", "/create");
    assert.ok(first);
    assert.equal(first.utm_source, "instagram");
    assert.equal(first.fbclid, "fb99");
    assert.ok(store.has(ATTRIBUTION_STORAGE_KEY));

    // Navigating to /login without UTM should preserve stored attribution
    const afterCleanNav = captureAttributionParams("", "/login");
    assert.ok(afterCleanNav);
    assert.equal(afterCleanNav.utm_source, "instagram");
    assert.equal(afterCleanNav.utm_campaign, "promo1");

    const stored = getStoredAttribution();
    assert.equal(stored?.fbclid, "fb99");
  } finally {
    globalThis.window = prevWindow;
  }
});
