/**
 * Pure functions and types for Theme Overrides (useThemeDraft).
 * No React dependencies, no side effects.
 */

export type ThemeOverrides = {
  palette?: Partial<Record<"primary" | "accent" | "background" | "surface" | "text", string>>;
  typography?: Partial<{
    heading_font: string;
    body_font: string;
    heading_font_url: string; // "" means remove custom font
    body_font_url: string;
    heading_weight: string;
    heading_size_hero: string;
    heading_style: string;
    heading_transform: string;
    heading_tracking: string;
  }>;
  theme_mode?: "light" | "dark";
  mood?: string;
};

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

function toHex(n: number): string {
  const clamped = Math.max(0, Math.min(255, Math.round(n)));
  return clamped.toString(16).padStart(2, "0");
}

function relativeLuminance(r: number, g: number, b: number): number {
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  const a = [sR, sG, sB].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/**
 * Derives a surface color based on the background color and optional text color.
 * For dark backgrounds, produces an elevated (slightly lighter) surface hex.
 * For light backgrounds, produces crisp #ffffff or subtle container tint.
 */
export function deriveSurface(background: string, text?: string): string {
  const bgRgb = parseHex(background);
  if (!bgRgb) {
    return `color-mix(in srgb, ${background} 92%, white)`;
  }

  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const textRgb = text ? parseHex(text) : null;

  // Dark background (luminance < 0.25)
  if (bgLum < 0.25) {
    const mixR = textRgb ? textRgb.r : 255;
    const mixG = textRgb ? textRgb.g : 255;
    const mixB = textRgb ? textRgb.b : 255;
    const r = bgRgb.r * 0.9 + mixR * 0.1;
    const g = bgRgb.g * 0.9 + mixG * 0.1;
    const b = bgRgb.b * 0.9 + mixB * 0.1;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Pure white or near-pure white background (lum >= 0.99, e.g. #ffffff)
  if (bgLum >= 0.99) {
    if (textRgb) {
      const r = bgRgb.r * 0.96 + textRgb.r * 0.04;
      const g = bgRgb.g * 0.96 + textRgb.g * 0.04;
      const b = bgRgb.b * 0.96 + textRgb.b * 0.04;
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    return "#f8fafc";
  }

  // Standard light off-white (e.g. #f8fafc, #faf7f2, #f1f5f9) -> pure white surface
  return "#ffffff";
}

/**
 * Returns true if the override object is null, undefined, or contains no effective override keys.
 */
export function isEmptyOverrides(o?: ThemeOverrides | null): boolean {
  if (!o || typeof o !== "object") return true;

  if (o.theme_mode !== undefined) return false;
  if (o.mood !== undefined) return false;

  if (o.palette && typeof o.palette === "object") {
    for (const val of Object.values(o.palette)) {
      if (val !== undefined && val !== null) return false;
    }
  }

  if (o.typography && typeof o.typography === "object") {
    for (const val of Object.values(o.typography)) {
      if (val !== undefined && val !== null) return false;
    }
  }

  return true;
}

/**
 * Checks deep equality of two ThemeOverrides objects.
 */
export function overridesEqual(
  a?: ThemeOverrides | null,
  b?: ThemeOverrides | null
): boolean {
  const emptyA = isEmptyOverrides(a);
  const emptyB = isEmptyOverrides(b);
  if (emptyA && emptyB) return true;
  if (emptyA !== emptyB) return false;

  if (!a || !b) return false;

  if (a.theme_mode !== b.theme_mode) return false;
  if (a.mood !== b.mood) return false;

  const paletteKeys: (keyof NonNullable<ThemeOverrides["palette"]>)[] = [
    "primary",
    "accent",
    "background",
    "surface",
    "text",
  ];
  for (const k of paletteKeys) {
    const valA = a.palette?.[k];
    const valB = b.palette?.[k];
    if (valA !== valB) return false;
  }

  const typographyKeys: (keyof NonNullable<ThemeOverrides["typography"]>)[] = [
    "heading_font",
    "body_font",
    "heading_font_url",
    "body_font_url",
    "heading_weight",
    "heading_size_hero",
    "heading_style",
    "heading_transform",
    "heading_tracking",
  ];
  for (const k of typographyKeys) {
    const valA = a.typography?.[k];
    const valB = b.typography?.[k];
    if (valA !== valB) return false;
  }

  return true;
}

/**
 * Helper to build font overrides for a preset font (clears font URL).
 */
export function presetFont(slot: "heading" | "body", name: string): ThemeOverrides {
  if (slot === "heading") {
    return {
      typography: {
        heading_font: name,
        heading_font_url: "",
      },
    };
  }
  return {
    typography: {
      body_font: name,
      body_font_url: "",
    },
  };
}

/**
 * Helper to build font overrides for a custom uploaded font (sets font URL).
 */
export function customFont(slot: "heading" | "body", name: string, url: string): ThemeOverrides {
  if (slot === "heading") {
    return {
      typography: {
        heading_font: name,
        heading_font_url: url,
      },
    };
  }
  return {
    typography: {
      body_font: name,
      body_font_url: url,
    },
  };
}

/**
 * Merges base design token with one or more override layers (e.g. base -> applied -> draft).
 * Never mutates base or any layer objects.
 * Later layers win.
 */
export function mergeThemeOverrides(
  base: any,
  ...layers: (ThemeOverrides | null | undefined)[]
): any {
  const result: Record<string, any> = {
    ...(base || {}),
    palette: { ...(base?.palette || {}) },
    typography: { ...(base?.typography || {}) },
  };

  for (const layer of layers) {
    if (!layer || typeof layer !== "object") continue;

    if (layer.theme_mode !== undefined) {
      result.theme_mode = layer.theme_mode;
    }

    if (layer.mood !== undefined) {
      result.mood = layer.mood;
    }

    if (layer.palette && typeof layer.palette === "object") {
      const nextPalette = { ...result.palette };
      for (const [key, val] of Object.entries(layer.palette)) {
        if (val !== undefined) {
          nextPalette[key] = val;
        }
      }

      // If background was changed without explicit surface, derive surface automatically
      if (layer.palette.background !== undefined && layer.palette.surface === undefined) {
        nextPalette.surface = deriveSurface(layer.palette.background, nextPalette.text);
      }

      result.palette = nextPalette;

      // Synchronize dark_palette if present only in dark mode applying only layer overrides,
      // so light palettes don't overwrite dark variants (Temuan 11 & Review Finding 1)
      if (result.dark_palette && result.theme_mode === "dark") {
        const darkNext = { ...result.dark_palette };
        for (const [k, v] of Object.entries(layer.palette)) {
          if (v !== undefined) {
            darkNext[k] = v;
          }
        }
        if (layer.palette.background !== undefined && layer.palette.surface === undefined) {
          darkNext.surface = deriveSurface(layer.palette.background, darkNext.text);
        }
        result.dark_palette = darkNext;
      }
    }

    if (layer.typography && typeof layer.typography === "object") {
      const nextTypography = { ...result.typography };
      for (const [key, val] of Object.entries(layer.typography)) {
        if (val !== undefined) {
          nextTypography[key] = val;
        }
      }
      result.typography = nextTypography;
    }
  }

  return result;
}

function readableTextColor(background?: string, currentText?: string): string | null {
  if (!background || !currentText) return null;
  const bgRgb = parseHex(background);
  const textRgb = parseHex(currentText);
  if (!bgRgb || !textRgb) return null;

  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const textLum = relativeLuminance(textRgb.r, textRgb.g, textRgb.b);
  const currentRatio = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

  if (currentRatio >= 4.5) return null;

  const whiteRatio = (1.0 + 0.05) / (bgLum + 0.05);
  const darkRgb = { r: 15, g: 23, b: 42 }; // #0f172a
  const darkLum = relativeLuminance(darkRgb.r, darkRgb.g, darkRgb.b);
  const darkRatio = (Math.max(bgLum, darkLum) + 0.05) / (Math.min(bgLum, darkLum) + 0.05);

  return whiteRatio >= darkRatio ? "#ffffff" : "#0f172a";
}

/**
 * Checks contrast between text and background. If < 4.5:1, returns a new token
 * with text replaced by high-contrast black (#0f172a) or white (#ffffff).
 * Checks palette and dark_palette independently (Review Finding 2).
 * Does not mutate input token or applied state.
 */
export function ensureReadableText(token: any): any {
  if (!token || typeof token !== "object") {
    return token;
  }

  let result = token;

  if (token.palette) {
    const fixedText = readableTextColor(token.palette.background, token.palette.text);
    if (fixedText) {
      result = {
        ...result,
        palette: {
          ...result.palette,
          text: fixedText,
        },
      };
    }
  }

  if (token.dark_palette) {
    const fixedDarkText = readableTextColor(token.dark_palette.background, token.dark_palette.text);
    if (fixedDarkText) {
      result = {
        ...result,
        dark_palette: {
          ...result.dark_palette,
          text: fixedDarkText,
        },
      };
    }
  }

  return result;
}

/**
 * Strips data URLs (e.g. uploaded font files) and string values exceeding 2 KB
 * so the overrides object is lightweight and safe to store in WIZARD_RESUME_KEY.
 */
export function stripHeavyOverrides(overrides: ThemeOverrides): ThemeOverrides {
  if (!overrides || typeof overrides !== "object") {
    return {};
  }

  const result: ThemeOverrides = {};

  if (overrides.theme_mode !== undefined) {
    result.theme_mode = overrides.theme_mode;
  }

  if (overrides.mood !== undefined) {
    result.mood = overrides.mood;
  }

  if (overrides.palette && typeof overrides.palette === "object") {
    const cleanPalette: NonNullable<ThemeOverrides["palette"]> = {};
    for (const [key, val] of Object.entries(overrides.palette) as [
      keyof NonNullable<ThemeOverrides["palette"]>,
      string | undefined
    ][]) {
      if (typeof val === "string") {
        if (!val.startsWith("data:") && val.length <= 2048) {
          cleanPalette[key] = val;
        }
      }
    }
    if (Object.keys(cleanPalette).length > 0) {
      result.palette = cleanPalette;
    }
  }

  if (overrides.typography && typeof overrides.typography === "object") {
    const cleanTypography: NonNullable<ThemeOverrides["typography"]> = {};
    for (const [key, val] of Object.entries(overrides.typography) as [
      keyof NonNullable<ThemeOverrides["typography"]>,
      string | undefined
    ][]) {
      if (typeof val === "string") {
        if (!val.startsWith("data:") && val.length <= 2048) {
          cleanTypography[key] = val;
        }
      }
    }
    if (Object.keys(cleanTypography).length > 0) {
      result.typography = cleanTypography;
    }
  }

  return result;
}

export interface BuildMoodOverridesOptions {
  currentApplied: ThemeOverrides;
  presets: { palettes: { override: ThemeOverrides }[]; fonts: { override: ThemeOverrides }[] };
  newMood: string;
  brandPalette?: Record<string, string> | null;
}

/**
 * Builds a new ThemeOverrides object for a mood switch.
 *
 * Layers (low -> high priority):
 *  1. Mood preset (palette, fonts, theme_mode)          -> replaced by the new mood
 *  2. Manual color edits                                -> replaced by the new mood (Undo available)
 *  3. Brand (from logo): ONLY primary + accent persist  -> background/surface/text and
 *     theme_mode always follow the mood, so a light logo palette never breaks a dark mood.
 *  4. Custom uploaded/URL fonts                         -> persist
 */
export function buildMoodOverrides(options: BuildMoodOverridesOptions): ThemeOverrides {
  const { currentApplied, presets, newMood, brandPalette } = options;
  const firstPalette = presets.palettes[0];
  const firstFont = presets.fonts[0];

  // 1. Target theme_mode always comes from the mood preset.
  const targetThemeMode =
    firstPalette?.override.theme_mode ??
    (newMood === "dark-premium" || newMood === "bold-dark" ? "dark" : "light");

  // 2. Palette: preset first, then brand identity colors (primary + accent only).
  let nextPalette: ThemeOverrides["palette"] | undefined;
  if (firstPalette?.override.palette) {
    nextPalette = { ...firstPalette.override.palette };
  }
  if (brandPalette) {
    const brandKeys = ["primary", "accent"] as const;
    for (const key of brandKeys) {
      const val = brandPalette[key];
      if (typeof val === "string" && val) {
        nextPalette = { ...(nextPalette ?? {}), [key]: val };
      }
    }
  }

  // 3. Typography: copy the WHOLE preset (name, weight, hero size, style, transform,
  //    tracking) so the new font is not combined with the old mood's weight/tracking.
  //    Custom uploaded/URL fonts persist per slot.
  const currentTypo = currentApplied.typography;
  // A Google Fonts URL belongs to a preset; only uploads (data:/own URL, Cloudinary) are "custom".
  const isCustomFontUrl = (url?: string) =>
    Boolean(url) && !/^https:\/\/fonts\.googleapis\.com\//.test(url as string);
  const hasCustomHeading = isCustomFontUrl(currentTypo?.heading_font_url);
  const hasCustomBody = isCustomFontUrl(currentTypo?.body_font_url);
  const presetTypo = firstFont?.override.typography ?? {};

  const nextTypography: NonNullable<ThemeOverrides["typography"]> = {
    ...presetTypo,
    heading_font: hasCustomHeading
      ? (currentTypo?.heading_font || "Inter")
      : (presetTypo.heading_font || "Inter"),
    body_font: hasCustomBody
      ? (currentTypo?.body_font || "Inter")
      : (presetTypo.body_font || "Inter"),
    // Non-custom slots keep the preset's own (Google Fonts) URL, or "" when it has none.
    heading_font_url: hasCustomHeading ? currentTypo?.heading_font_url : (presetTypo.heading_font_url ?? ""),
    body_font_url: hasCustomBody ? currentTypo?.body_font_url : (presetTypo.body_font_url ?? ""),
  };

  return {
    palette: nextPalette,
    typography: nextTypography,
    theme_mode: targetThemeMode,
    mood: newMood,
  };
}
