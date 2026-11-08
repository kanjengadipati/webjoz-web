import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeThemeOverrides,
  isEmptyOverrides,
  overridesEqual,
  presetFont,
  customFont,
  deriveSurface,
} from "../lib/theme-overrides.ts";

test("mergeThemeOverrides does not mutate base or layers", () => {
  const baseLayout = { hero_style: "split-image", corner_radius: "rounded" };
  const base = {
    mood: "modern-clean",
    theme_mode: "light",
    layout: baseLayout,
    palette: { primary: "#2563eb", background: "#f8fafc", text: "#0f172a" },
    typography: { heading_font: "Inter", body_font: "Inter" },
  };

  const applied = {
    palette: { primary: "#7c3aed" },
  };

  const draft = {
    palette: { primary: "#dc2626" },
  };

  const snapshotBase = JSON.parse(JSON.stringify(base));
  const snapshotApplied = JSON.parse(JSON.stringify(applied));
  const snapshotDraft = JSON.parse(JSON.stringify(draft));

  const result = mergeThemeOverrides(base, applied, draft);

  // Original objects remain identical
  assert.deepEqual(base, snapshotBase);
  assert.deepEqual(applied, snapshotApplied);
  assert.deepEqual(draft, snapshotDraft);

  // Layout reference is preserved untouched
  assert.equal(result.layout, baseLayout);
  assert.equal(result.mood, "modern-clean");
});

test("mergeThemeOverrides obeys layer precedence: draft > applied > base", () => {
  const base = {
    palette: { primary: "#111111", accent: "#222222", background: "#f8fafc", text: "#0f172a" },
    typography: { heading_font: "Inter", body_font: "Roboto" },
    theme_mode: "light",
  };

  const applied = {
    palette: { primary: "#333333" },
    typography: { heading_font: "Playfair Display" },
    theme_mode: "dark",
  };

  const draft = {
    palette: { primary: "#444444" },
  };

  const result = mergeThemeOverrides(base, applied, draft);

  // Primary: draft won
  assert.equal(result.palette.primary, "#444444");
  // Accent: base kept (applied & draft didn't touch it)
  assert.equal(result.palette.accent, "#222222");
  // Heading font: applied won (draft didn't touch it)
  assert.equal(result.typography.heading_font, "Playfair Display");
  // Body font: base kept
  assert.equal(result.typography.body_font, "Roboto");
  // Theme mode: applied won
  assert.equal(result.theme_mode, "dark");
});

test("mergeThemeOverrides derives surface automatically when background changes without surface", () => {
  const base = {
    palette: { primary: "#2563eb", background: "#ffffff", surface: "#ffffff", text: "#0f172a" },
  };

  // Change background to dark without specifying surface
  const draft = {
    palette: { background: "#0f172a" },
  };

  const result = mergeThemeOverrides(base, draft);
  assert.equal(result.palette.background, "#0f172a");
  // Surface is automatically derived from the new dark background
  assert.ok(result.palette.surface);
  assert.notEqual(result.palette.surface, "#ffffff");
  assert.match(result.palette.surface, /^#[0-9a-fA-F]{6}$/);

  // If surface is explicitly provided in layer, use it instead of deriving
  const draftWithSurface = {
    palette: { background: "#0f172a", surface: "#112233" },
  };
  const resultExplicit = mergeThemeOverrides(base, draftWithSurface);
  assert.equal(resultExplicit.palette.surface, "#112233");
});

test("presetFont clears font URL and customFont sets URL", () => {
  const headingPreset = presetFont("heading", "Outfit");
  assert.deepEqual(headingPreset, {
    typography: {
      heading_font: "Outfit",
      heading_font_url: "",
    },
  });

  const bodyPreset = presetFont("body", "Plus Jakarta Sans");
  assert.deepEqual(bodyPreset, {
    typography: {
      body_font: "Plus Jakarta Sans",
      body_font_url: "",
    },
  });

  const headingCustom = customFont("heading", "MyBrandFont", "https://example.com/font.woff2");
  assert.deepEqual(headingCustom, {
    typography: {
      heading_font: "MyBrandFont",
      heading_font_url: "https://example.com/font.woff2",
    },
  });

  const bodyCustom = customFont("body", "MyBodyFont", "https://example.com/body.woff2");
  assert.deepEqual(bodyCustom, {
    typography: {
      body_font: "MyBodyFont",
      body_font_url: "https://example.com/body.woff2",
    },
  });
});

test("deriveSurface produces valid hex for light and dark backgrounds", () => {
  // Dark background
  const darkSurface = deriveSurface("#0a0a0a", "#f5f5f5");
  assert.match(darkSurface, /^#[0-9a-fA-F]{6}$/);
  assert.notEqual(darkSurface, "#0a0a0a");

  // Pure white background
  const whiteSurface = deriveSurface("#ffffff", "#1e293b");
  assert.ok(whiteSurface);

  // Off-white background
  const offWhiteSurface = deriveSurface("#f8fafc", "#0f172a");
  assert.equal(offWhiteSurface, "#ffffff");
});

test("isEmptyOverrides correctly identifies empty vs non-empty overrides", () => {
  assert.equal(isEmptyOverrides(null), true);
  assert.equal(isEmptyOverrides(undefined), true);
  assert.equal(isEmptyOverrides({}), true);
  assert.equal(isEmptyOverrides({ palette: {} }), true);
  assert.equal(isEmptyOverrides({ palette: { primary: undefined } }), true);
  assert.equal(isEmptyOverrides({ typography: {} }), true);

  assert.equal(isEmptyOverrides({ theme_mode: "dark" }), false);
  assert.equal(isEmptyOverrides({ palette: { primary: "#ff0000" } }), false);
  assert.equal(isEmptyOverrides({ typography: { heading_font: "Inter" } }), false);
  assert.equal(isEmptyOverrides({ typography: { heading_font_url: "" } }), false);
});

test("overridesEqual compares equality correctly", () => {
  assert.equal(overridesEqual(null, undefined), true);
  assert.equal(overridesEqual({}, {}), true);
  assert.equal(overridesEqual({ palette: {} }, null), true);

  const a = {
    palette: { primary: "#111111", background: "#ffffff" },
    typography: { heading_font: "Inter" },
    theme_mode: "light",
  };

  const b = {
    palette: { primary: "#111111", background: "#ffffff" },
    typography: { heading_font: "Inter" },
    theme_mode: "light",
  };

  assert.equal(overridesEqual(a, b), true);

  // Different palette
  assert.equal(overridesEqual(a, { ...b, palette: { primary: "#222222" } }), false);

  // Different typography
  assert.equal(overridesEqual(a, { ...b, typography: { heading_font: "Outfit" } }), false);

  // Different theme_mode
  assert.equal(overridesEqual(a, { ...b, theme_mode: "dark" }), false);
});
