import test from "node:test";
import assert from "node:assert/strict";
import { extractColorsFromPixels, hexToRgb, getContrastRatio, rgbToHex } from "../lib/brand-color-extractor.ts";
import { applyBrandPalette } from "../lib/apply-brand-palette.ts";

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

test("dark palette satisfies WCAG contrast (>= 4.5:1)", () => {
  const pixels = [];
  for (let i = 0; i < 64; i++) {
    pixels.push(50, 100, 200, 255);
  }
  const darkPalette = extractColorsFromPixels(new Uint8ClampedArray(pixels), true);
  assert.equal(darkPalette.isDark, true);
  assert.ok(darkPalette.background);
  assert.ok(darkPalette.text);

  const bgRgb = hexToRgb(darkPalette.background);
  const textRgb = hexToRgb(darkPalette.text);
  assert.ok(bgRgb && textRgb);
  const ratio = getContrastRatio(bgRgb, textRgb);
  assert.ok(ratio >= 4.5, `Contrast ratio ${ratio} must be >= 4.5:1`);
});

test("applyBrandPalette merges palette and themeMode without touching typography and radius", () => {
  const initialToken = {
    typography: {
      heading_font: "Playfair Display",
      body_font: "Plus Jakarta Sans",
    },
    radius: "rounded-2xl",
    mood: "dark-premium",
    palette: {
      primary: "#default_primary",
      accent: "#default_accent",
      background: "#default_bg",
    },
  };

  const brandPalette = {
    primary: "#E11D48",
    accent: "#FBBF24",
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F8FAFC",
  };

  const merged = applyBrandPalette(initialToken, brandPalette, "dark");

  // Palette updated
  assert.equal(merged.palette.primary, "#E11D48");
  assert.equal(merged.palette.accent, "#FBBF24");
  assert.equal(merged.palette.background, "#0F172A");

  // Theme mode updated
  assert.equal(merged.theme_mode, "dark");

  // Typography & radius preserved intact
  assert.equal(merged.typography.heading_font, "Playfair Display");
  assert.equal(merged.typography.body_font, "Plus Jakarta Sans");
  assert.equal(merged.radius, "rounded-2xl");
  assert.equal(merged.mood, "dark-premium");
});

test("applyBrandPalette handles null/empty palette gracefully", () => {
  const initialToken = { mood: "clean-light", palette: { primary: "#000000" } };
  const result1 = applyBrandPalette(initialToken, null);
  assert.deepEqual(result1, initialToken);

  const result2 = applyBrandPalette(initialToken, {}, "light");
  assert.equal(result2.theme_mode, "light");
});
