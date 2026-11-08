import test from "node:test";
import assert from "node:assert/strict";
import {
  getFontMime,
  WIZARD_FONT_MAX_BYTES,
  WIZARD_FONT_EXTS,
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

test("WIZARD_FONT_MAX_BYTES is set to 500 KB", () => {
  assert.equal(WIZARD_FONT_MAX_BYTES, 500 * 1024);
});

test("WIZARD_FONT_EXTS supports .woff2, .woff, .ttf, .otf", () => {
  assert.deepEqual(WIZARD_FONT_EXTS, [".woff2", ".woff", ".ttf", ".otf"]);
});

test("FEATURE_FLAGS.THEME_PANEL defaults to true", () => {
  assert.equal(typeof FEATURE_FLAGS.THEME_PANEL, "boolean");
});

