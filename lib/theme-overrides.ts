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

      // Synchronize dark_palette if present so buildCssVars doesn't fallback to stale AI dark tokens
      if (result.dark_palette) {
        result.dark_palette = {
          ...result.dark_palette,
          ...nextPalette,
        };
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

/**
 * Checks contrast between text and background. If < 4.5:1, returns a new token
 * with text replaced by high-contrast black (#0f172a) or white (#ffffff).
 * Does not mutate input token or applied state.
 */
export function ensureReadableText(token: any): any {
  if (!token || typeof token !== "object" || !token.palette) {
    return token;
  }

  const { background, text } = token.palette;
  if (!background || !text) {
    return token;
  }

  const bgRgb = parseHex(background);
  const textRgb = parseHex(text);
  if (!bgRgb || !textRgb) {
    return token;
  }

  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const textLum = relativeLuminance(textRgb.r, textRgb.g, textRgb.b);
  const currentRatio = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

  if (currentRatio >= 4.5) {
    return token;
  }

  // Under 4.5:1 -> pick higher contrast between white and dark
  const whiteRatio = (1.0 + 0.05) / (bgLum + 0.05);
  const darkRgb = { r: 15, g: 23, b: 42 }; // #0f172a
  const darkLum = relativeLuminance(darkRgb.r, darkRgb.g, darkRgb.b);
  const darkRatio = (Math.max(bgLum, darkLum) + 0.05) / (Math.min(bgLum, darkLum) + 0.05);

  const fallbackText = whiteRatio >= darkRatio ? "#ffffff" : "#0f172a";

  return {
    ...token,
    palette: {
      ...token.palette,
      text: fallbackText,
    },
    ...(token.dark_palette ? {
      dark_palette: {
        ...token.dark_palette,
        text: fallbackText,
      },
    } : {}),
  };
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
