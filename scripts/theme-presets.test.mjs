import test from "node:test";
import assert from "node:assert/strict";
import {
  THEME_PRESETS,
  isPaletteApplied,
  isFontApplied,
  getPresets,
} from "../lib/theme-presets.ts";

function parseHex(hex) {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const c1 = parseHex(hex1);
  const c2 = parseHex(hex2);
  assert.ok(c1, `Invalid hex1: ${hex1}`);
  assert.ok(c2, `Invalid hex2: ${hex2}`);
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const EXPECTED_MOODS = [
  "clean-modern",
  "warm-earthy",
  "bold-vibrant",
  "dark-premium",
  "bold-dark",
  "retro",
  "futuristic",
];

test("THEME_PRESETS defines all 7 moods", () => {
  for (const mood of EXPECTED_MOODS) {
    assert.ok(THEME_PRESETS[mood], `Missing mood: ${mood}`);
    assert.equal(THEME_PRESETS[mood].palettes.length, 6, `Mood ${mood} must have 6 palettes`);
    assert.equal(THEME_PRESETS[mood].fonts.length, 3, `Mood ${mood} must have 3 fonts`);
  }
});

test("Each palette preset has 5 complete keys and valid hex codes", () => {
  const hexRegex = /^#[0-9a-fA-F]{6}$/;

  for (const mood of EXPECTED_MOODS) {
    const data = THEME_PRESETS[mood];
    for (const palette of data.palettes) {
      assert.ok(palette.id, `Missing palette id in ${mood}`);
      assert.ok(palette.name, `Missing palette name in ${mood}`);
      assert.equal(palette.swatches.length, 4, `Palette ${palette.id} must have 4 swatches`);

      const p = palette.override.palette;
      assert.ok(p, `Missing palette override in ${palette.id}`);
      assert.match(p.primary, hexRegex, `Invalid primary in ${palette.id}`);
      assert.match(p.accent, hexRegex, `Invalid accent in ${palette.id}`);
      assert.match(p.background, hexRegex, `Invalid background in ${palette.id}`);
      assert.match(p.surface, hexRegex, `Invalid surface in ${palette.id}`);
      assert.match(p.text, hexRegex, `Invalid text in ${palette.id}`);
      assert.ok(
        palette.override.theme_mode === "light" || palette.override.theme_mode === "dark",
        `Invalid theme_mode in ${palette.id}`
      );
    }
  }
});

test("Every palette preset satisfies WCAG AA text contrast (>= 4.5:1)", () => {
  for (const mood of EXPECTED_MOODS) {
    const data = THEME_PRESETS[mood];
    for (const palette of data.palettes) {
      const p = palette.override.palette;
      const ratio = getContrastRatio(p.text, p.background);
      assert.ok(
        ratio >= 4.5,
        `Palette ${palette.name} (${mood}) has text contrast ratio ${ratio.toFixed(2)}:1 (< 4.5:1)`
      );
    }
  }
});

test("Each font preset has heading, body, and typography override", () => {
  for (const mood of EXPECTED_MOODS) {
    const data = THEME_PRESETS[mood];
    for (const font of data.fonts) {
      assert.ok(font.id, `Missing font id in ${mood}`);
      assert.ok(font.name, `Missing font name in ${mood}`);
      assert.ok(font.heading, `Missing heading name in ${font.id}`);
      assert.ok(font.body, `Missing body name in ${font.id}`);

      const t = font.override.typography;
      assert.ok(t, `Missing typography override in ${font.id}`);
      assert.equal(t.heading_font, font.heading);
      assert.equal(t.body_font, font.body);
    }
  }
});

test("isPaletteApplied detects exact matches", () => {
  const preset = THEME_PRESETS["warm-earthy"].palettes[0];

  // Exact match
  assert.equal(
    isPaletteApplied(preset, {
      palette: { ...preset.override.palette },
      theme_mode: preset.override.theme_mode,
    }),
    true
  );

  // Different primary
  assert.equal(
    isPaletteApplied(preset, {
      palette: { ...preset.override.palette, primary: "#000000" },
      theme_mode: preset.override.theme_mode,
    }),
    false
  );

  // Different theme_mode
  assert.equal(
    isPaletteApplied(preset, {
      palette: { ...preset.override.palette },
      theme_mode: "dark",
    }),
    false
  );

  // Empty applied
  assert.equal(isPaletteApplied(preset, {}), false);
});

test("isFontApplied detects exact typography matches", () => {
  const font = THEME_PRESETS["warm-earthy"].fonts[0];

  assert.equal(
    isFontApplied(font, {
      typography: {
        heading_font: font.heading,
        body_font: font.body,
      },
    }),
    true
  );

  assert.equal(
    isFontApplied(font, {
      typography: {
        heading_font: "AnotherFont",
        body_font: font.body,
      },
    }),
    false
  );

  assert.equal(isFontApplied(font, {}), false);
});

test("getPresets falls back to clean-modern for unknown mood", () => {
  const fallback = getPresets("unknown-mood");
  assert.deepEqual(fallback, THEME_PRESETS["clean-modern"]);

  const warm = getPresets("warm-earthy");
  assert.deepEqual(warm, THEME_PRESETS["warm-earthy"]);
});
