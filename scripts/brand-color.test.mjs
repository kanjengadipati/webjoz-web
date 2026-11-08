import test from "node:test";
import assert from "node:assert/strict";
import { extractColorsFromPixels, hexToRgb, getContrastRatio, rgbToHex } from "../lib/brand-color-extractor.js";

test("rgbToHex and hexToRgb round-trip", () => {
  const hex = "#1f6fb5";
  const rgb = hexToRgb(hex);
  assert.ok(rgb);
  assert.equal(rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase(), hex);
});

test("contrast ratio calculation", () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const ratio = getContrastRatio(black, white);
  assert.ok(ratio >= 20); // 21:1 for black and white
});

test("extractColorsFromPixels extracts dominant blue and gold accent", () => {
  // Simulate 64 pixels: mostly blue (31, 111, 181), some yellow (242, 182, 50), and transparent background
  const pixels = [];
  // 40 blue pixels
  for (let i = 0; i < 40; i++) {
    pixels.push(31, 111, 181, 255);
  }
  // 15 gold pixels
  for (let i = 0; i < 15; i++) {
    pixels.push(242, 182, 50, 255);
  }
  // 9 transparent pixels
  for (let i = 0; i < 9; i++) {
    pixels.push(0, 0, 0, 0);
  }

  const palette = extractColorsFromPixels(new Uint8ClampedArray(pixels), false);
  assert.ok(palette.primary);
  assert.ok(palette.accent);
  assert.notEqual(palette.primary, palette.accent);
  assert.equal(palette.isDark, false);
});

