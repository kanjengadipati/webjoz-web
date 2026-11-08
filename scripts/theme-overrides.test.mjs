import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeThemeOverrides,
  isEmptyOverrides,
  overridesEqual,
  presetFont,
  customFont,
  deriveSurface,
  ensureReadableText,
  stripHeavyOverrides,
} from "../lib/theme-overrides.ts";
import { applyBrandPalette } from "../lib/apply-brand-palette.ts";

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

test("ensureReadableText guards contrast >= 4.5:1 without mutating input", () => {
  // Low contrast: dark grey text #666666 on near-black background #111111 (< 4.5:1)
  const token = {
    palette: {
      background: "#111111",
      text: "#333333",
    },
  };
  const snapshot = JSON.parse(JSON.stringify(token));

  const readable = ensureReadableText(token);

  // Original token not mutated
  assert.deepEqual(token, snapshot);

  // Text replaced with high contrast fallback (white on dark)
  assert.equal(readable.palette.text, "#ffffff");

  // Valid contrast: white on dark is already >= 4.5:1, left untouched
  const goodToken = {
    palette: {
      background: "#ffffff",
      text: "#0f172a",
    },
  };
  assert.equal(ensureReadableText(goodToken).palette.text, "#0f172a");
});

test("stripHeavyOverrides strips data URLs and strings > 2048 chars", () => {
  const overrides = {
    theme_mode: "dark",
    palette: {
      primary: "#2563eb",
      accent: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=", // data URL in palette (unlikely but should be stripped)
    },
    typography: {
      heading_font: "Outfit",
      heading_font_url: "https://fonts.gstatic.com/s/outfit/v11/abc.woff2", // keep regular url
      body_font: "CustomFont",
      body_font_url: "data:font/woff2;base64," + "A".repeat(3000), // data URL > 2KB
    },
  };

  const stripped = stripHeavyOverrides(overrides);

  assert.equal(stripped.theme_mode, "dark");
  assert.equal(stripped.palette.primary, "#2563eb");
  assert.equal(stripped.palette.accent, undefined);
  assert.equal(stripped.typography.heading_font, "Outfit");
  assert.equal(stripped.typography.heading_font_url, "https://fonts.gstatic.com/s/outfit/v11/abc.woff2");
  assert.equal(stripped.typography.body_font, "CustomFont");
  assert.equal(stripped.typography.body_font_url, undefined);
});

test("five-layer merge order: AI -> brand palette -> applied -> draft -> ensureReadableText", () => {
  // 1. AI base token
  const aiToken = {
    palette: {
      primary: "#aaaaaa",
      accent: "#bbbbbb",
      background: "#111111",
      surface: "#222222",
      text: "#333333", // low contrast on #111111
    },
    typography: { heading_font: "Inter", body_font: "Inter" },
    theme_mode: "dark",
  };

  // 2. Brand palette from logo (pra-generate)
  const brandPalette = {
    primary: "#0000ff", // blue
  };
  const withBrand = applyBrandPalette(aiToken, brandPalette);
  assert.equal(withBrand.palette.primary, "#0000ff");

  // 3. Applied theme overrides (pasca-generate)
  const applied = {
    palette: { accent: "#00ff00" }, // green accent overrides AI
  };

  // 4. Draft overrides (in-flight)
  const draft = {
    palette: { primary: "#ff0000" }, // red primary overrides brand palette
  };

  const merged = mergeThemeOverrides(withBrand, applied, draft);
  const finalToken = ensureReadableText(merged);

  // Draft won over brand palette and AI
  assert.equal(finalToken.palette.primary, "#ff0000");
  // Applied won over AI accent
  assert.equal(finalToken.palette.accent, "#00ff00");
  // ensureReadableText fixed the unreadable text #333333 on #111111
  assert.equal(finalToken.palette.text, "#ffffff");
});

test("history entry merge does not mutate original history entry", () => {
  const historyEntryToken = {
    palette: { primary: "#123456", background: "#ffffff", text: "#000000" },
    typography: { heading_font: "Roboto" },
  };
  const snapshot = JSON.parse(JSON.stringify(historyEntryToken));

  const applied = {
    palette: { primary: "#654321" },
  };

  const targetMerged = ensureReadableText(mergeThemeOverrides(historyEntryToken, applied));

  // Original entry token unchanged
  assert.deepEqual(historyEntryToken, snapshot);
  assert.equal(targetMerged.palette.primary, "#654321");
});

test("dark_palette is NOT overwritten by light mode palettes (Temuan 11)", () => {
  const base = {
    theme_mode: "light",
    palette: { primary: "#111111", background: "#ffffff" },
    dark_palette: { primary: "#eeeeee", background: "#121212" },
  };

  const appliedLight = {
    palette: { primary: "#ffaa00", background: "#f8f9fa" },
  };

  const merged = mergeThemeOverrides(base, appliedLight);
  // In light mode, dark_palette stays preserved
  assert.equal(merged.dark_palette.primary, "#eeeeee");
  assert.equal(merged.dark_palette.background, "#121212");
  assert.equal(merged.palette.primary, "#ffaa00");

  // In dark mode, dark_palette is synchronized
  const baseDark = {
    theme_mode: "dark",
    palette: { primary: "#111111", background: "#121212" },
    dark_palette: { primary: "#111111", background: "#121212" },
  };

  const appliedDark = {
    palette: { primary: "#ffaa00", background: "#0a0a0a" },
  };

  const mergedDark = mergeThemeOverrides(baseDark, appliedDark);
  assert.equal(mergedDark.dark_palette.primary, "#ffaa00");
  assert.equal(mergedDark.dark_palette.background, "#0a0a0a");
});

test("in dark mode, overriding only primary preserves dark_palette.background and surface (Review Finding 1)", () => {
  const darkToken = {
    theme_mode: "dark",
    palette: { primary: "#60a5fa", accent: "#fbbf24", background: "#ffffff", surface: "#f8fafc", text: "#0f172a" },
    dark_palette: { primary: "#60a5fa", accent: "#fbbf24", background: "#0b1020", surface: "#141a2e", text: "#e5e7eb" },
  };

  const overridePrimary = {
    palette: { primary: "#ff0000" },
  };

  const merged = mergeThemeOverrides(darkToken, overridePrimary);
  assert.equal(merged.dark_palette.primary, "#ff0000");
  // Background, surface, text must remain dark values, NOT overwritten by palette (#ffffff)
  assert.equal(merged.dark_palette.background, "#0b1020");
  assert.equal(merged.dark_palette.surface, "#141a2e");
  assert.equal(merged.dark_palette.text, "#e5e7eb");
});

test("ensureReadableText adjusts palette and dark_palette contrast independently (Review Finding 2)", () => {
  const token = {
    theme_mode: "light",
    palette: { background: "#ffffff", text: "#f5f5f5" }, // low contrast on white -> needs dark text
    dark_palette: { background: "#0b1020", text: "#e5e7eb" }, // already high contrast on dark -> must NOT change
  };

  const result = ensureReadableText(token);
  assert.equal(result.palette.text, "#0f172a"); // adjusted to dark text
  assert.equal(result.dark_palette.text, "#e5e7eb"); // preserved light text
});


