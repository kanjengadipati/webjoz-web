import test from "node:test";
import assert from "node:assert/strict";
import {
  getFontMime,
  fontExtFromMime,
  dataUrlToBlob,
  restoreCustomFontUrls,
  syncCustomFontStorage,
  clearCustomFontStorage,
  WIZARD_FONT_MAX_BYTES,
  WIZARD_FONT_EXTS,
  WIZARD_CUSTOM_FONT_KEY,
  LEGACY_TYPOGRAPHY_KEY,
} from "../lib/wizard-font-storage.ts";
import { FEATURE_FLAGS } from "../lib/feature-flags.ts";

test("getFontMime returns correct MIME type for font extensions", () => {
  assert.equal(getFontMime("custom-font.woff2"), "font/woff2");
  assert.equal(getFontMime("custom-font.WOFF2"), "font/woff2");
  assert.equal(getFontMime("heading.woff"), "font/woff");
  assert.equal(getFontMime("body.ttf"), "font/ttf");
  assert.equal(getFontMime("title.otf"), "font/otf");
  assert.equal(getFontMime("unknown.xyz"), "font/woff2");
});

test("fontExtFromMime returns correct extension for font MIME types", () => {
  assert.equal(fontExtFromMime("font/woff2"), "woff2");
  assert.equal(fontExtFromMime("application/font-woff2"), "woff2");
  assert.equal(fontExtFromMime("font/woff"), "woff");
  assert.equal(fontExtFromMime("font/ttf"), "ttf");
  assert.equal(fontExtFromMime("font/truetype"), "ttf");
  assert.equal(fontExtFromMime("font/otf"), "otf");
  assert.equal(fontExtFromMime("font/opentype"), "otf");
  assert.equal(fontExtFromMime("unknown/mime"), "woff2");
});

test("dataUrlToBlob converts base64 data URL to Blob without fetch", async () => {
  const sampleText = "Hello Webjoz Font Test";
  const base64 = Buffer.from(sampleText, "utf-8").toString("base64");
  const dataUrl = `data:font/woff2;base64,${base64}`;

  const blob = dataUrlToBlob(dataUrl);
  assert.equal(blob.type, "font/woff2");
  assert.equal(blob.size, Buffer.byteLength(sampleText));

  const text = await blob.text();
  assert.equal(text, sampleText);
});

test("restoreCustomFontUrls restores dataUrl only if font name matches and url was stripped", () => {
  const stored = {
    heading: { name: "Custom Sans", dataUrl: "data:font/woff2;base64,AAA..." },
    body: { name: "Custom Serif", dataUrl: "data:font/woff2;base64,BBB..." },
  };

  // Case 1: Applied matches stored name and has no URL -> restore
  const appliedMatching = {
    typography: {
      heading_font: "Custom Sans",
      heading_font_url: "",
      body_font: "Inter",
      body_font_url: "",
    },
  };
  const restored = restoreCustomFontUrls(appliedMatching, stored);
  assert.equal(restored.typography?.heading_font_url, "data:font/woff2;base64,AAA...");
  assert.equal(restored.typography?.body_font_url, ""); // body was Inter, not Custom Serif

  // Case 2: User changed heading to a preset -> DO NOT restore cancelled custom font
  const appliedPreset = {
    typography: {
      heading_font: "Playfair Display",
      heading_font_url: "",
      body_font: "Inter",
      body_font_url: "",
    },
  };
  const restoredPreset = restoreCustomFontUrls(appliedPreset, stored);
  assert.equal(restoredPreset.typography?.heading_font_url, "");
  assert.equal(restoredPreset.typography?.heading_font, "Playfair Display");
});

test("syncCustomFontStorage and clearCustomFontStorage behave properly in window environment", () => {
  // Mock localStorage
  const mockStorage = new Map();
  globalThis.window = {};
  globalThis.localStorage = {
    getItem: (k) => mockStorage.get(k) ?? null,
    setItem: (k, v) => mockStorage.set(k, v),
    removeItem: (k) => mockStorage.delete(k),
  };

  // Sync with custom font data URL -> stores JSON
  syncCustomFontStorage({
    heading_font: "MyFont",
    heading_font_url: "data:font/woff2;base64,123",
  });
  assert.ok(mockStorage.has(WIZARD_CUSTOM_FONT_KEY));
  const parsed = JSON.parse(mockStorage.get(WIZARD_CUSTOM_FONT_KEY));
  assert.equal(parsed.heading.name, "MyFont");

  // Sync with preset font (no data: URL) -> removes from storage
  syncCustomFontStorage({
    heading_font: "Inter",
    heading_font_url: "",
  });
  assert.equal(mockStorage.has(WIZARD_CUSTOM_FONT_KEY), false);

  // Clear removes both active and legacy keys
  mockStorage.set(WIZARD_CUSTOM_FONT_KEY, "test");
  mockStorage.set(LEGACY_TYPOGRAPHY_KEY, "legacy");
  clearCustomFontStorage();
  assert.equal(mockStorage.has(WIZARD_CUSTOM_FONT_KEY), false);
  assert.equal(mockStorage.has(LEGACY_TYPOGRAPHY_KEY), false);

  delete globalThis.window;
  delete globalThis.localStorage;
});

test("WIZARD_FONT_MAX_BYTES is set to 500 KB", () => {
  assert.equal(WIZARD_FONT_MAX_BYTES, 500 * 1024);
});

test("WIZARD_FONT_EXTS supports .woff2, .woff, .ttf, .otf", () => {
  assert.deepEqual(WIZARD_FONT_EXTS, [".woff2", ".woff", ".ttf", ".otf"]);
});

import {
  safeFamily,
  safeFontUrl,
  fontFingerprint,
  parseGoogleFontsUrl,
} from "../components/templates/helpers.ts";

test("safeFamily sanitizes CSS font family name", () => {
  assert.equal(safeFamily("Plus Jakarta Sans"), "Plus Jakarta Sans");
  assert.equal(safeFamily("MyFont'; alert(1); /*"), "MyFont alert1");
  assert.equal(safeFamily("font-family: 'bad';"), "font-family bad");
  assert.equal(safeFamily("   Clean Font   "), "Clean Font");
});

test("safeFontUrl validates and sanitizes font URLs", () => {
  // Valid https font URLs
  assert.equal(
    safeFontUrl("https://res.cloudinary.com/fonts/my-font.woff2"),
    "https://res.cloudinary.com/fonts/my-font.woff2"
  );
  // Valid base64 data URL
  const validDataUrl = "data:font/woff2;base64,d09GMgABAAAAAA==";
  assert.equal(safeFontUrl(validDataUrl), validDataUrl);

  // Insecure or dangerous URLs rejected
  assert.equal(safeFontUrl("http://insecure.com/font.woff2"), null);
  assert.equal(safeFontUrl("javascript:alert(1)"), null);
  assert.equal(safeFontUrl("data:text/html;base64,PHNjcmlwdD4="), null);
  assert.equal(safeFontUrl("not-a-url"), null);
});

test("fontFingerprint generates length and tail fingerprint", () => {
  const url = "https://example.com/fonts/really-long-path-to-custom-font.woff2";
  const fp = fontFingerprint(url);
  assert.ok(fp.includes(":"));
  assert.equal(fp.startsWith(String(url.length)), true);
});

test("parseGoogleFontsUrl extracts family name correctly", () => {
  const url1 = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap";
  assert.deepEqual(parseGoogleFontsUrl(url1), { family: "Plus Jakarta Sans" });

  const url2 = "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap";
  assert.deepEqual(parseGoogleFontsUrl(url2), { family: "Playfair Display" });

  // Non-google URLs return null
  assert.equal(parseGoogleFontsUrl("https://example.com/font.css"), null);
  assert.equal(parseGoogleFontsUrl("invalid url"), null);
});


