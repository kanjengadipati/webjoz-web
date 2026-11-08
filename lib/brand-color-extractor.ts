/**
 * Client-side brand color extraction from image files / data URLs.
 * Extracts primary, accent, background, surface, and text colors
 * ensuring good visual harmony and WCAG contrast.
 *
 * 100% browser-based with HTML5 Canvas (0 AI tokens, 0 server cost).
 */

export interface ExtractedBrandPalette {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  isDark: boolean;
}

export interface BrandLogoExtractResult {
  light: ExtractedBrandPalette;
  dark: ExtractedBrandPalette;
  dominantHex: string;
  accentHex: string;
  recommendedTheme: "light" | "dark";
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

export function getRelativeLuminance(rgb: RGB): number {
  const srgb = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function isDarkColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  return getRelativeLuminance(rgb) < 0.45;
}

function getHSL(rgb: RGB): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function colorDistance(c1: RGB, c2: RGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Extract dominant palette from raw RGBA pixel data (64x64 or 128x128).
 */
export function extractColorsFromPixels(
  data: Uint8ClampedArray | number[],
  preferDarkTheme: boolean = false
): ExtractedBrandPalette {
  const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
  const step = 4; // 1 pixel = 4 bytes (r,g,b,a)

  for (let i = 0; i < data.length; i += step * 2) {
    const a = data[i + 3];
    if (a < 120) continue; // Skip transparent

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Quantize into buckets of 24
    const qr = Math.round(r / 24) * 24;
    const qg = Math.round(g / 24) * 24;
    const qb = Math.round(b / 24) * 24;

    const key = `${qr},${qg},${qb}`;
    if (!buckets[key]) {
      buckets[key] = { r: qr, g: qg, b: qb, count: 1 };
    } else {
      buckets[key].count++;
    }
  }

  const entries = Object.values(buckets);
  if (entries.length === 0) {
    // Fallback standard brand palette
    return preferDarkTheme
      ? {
          primary: "#38bdf8",
          accent: "#f59e0b",
          background: "#090d16",
          surface: "#131b2e",
          text: "#f8fafc",
          textMuted: "#94a3b8",
          isDark: true,
        }
      : {
          primary: "#2563eb",
          accent: "#f59e0b",
          background: "#f8fafc",
          surface: "#ffffff",
          text: "#0f172a",
          textMuted: "#64748b",
          isDark: false,
        };
  }

  // Score candidates: prioritize colorful/vibrant colors for primary & accent
  const scored = entries
    .map((e) => {
      const hsl = getHSL(e);
      // Penalize pure black and pure white for primary/accent
      const isExtreme = hsl.l < 0.1 || hsl.l > 0.92;
      // High saturation and balanced lightness score higher
      const saturationBonus = hsl.s * 2.5;
      const lightnessScore = 1 - Math.abs(hsl.l - 0.5) * 1.5;
      const score = (isExtreme ? 0.05 : 1) * e.count * (1 + saturationBonus + lightnessScore);
      return { ...e, score, hsl };
    })
    .sort((a, b) => b.score - a.score);

  const primaryRgb: RGB = scored[0] || { r: 37, g: 99, b: 235 };

  // Find accent: distinct from primary (distance >= 50)
  let accentRgb: RGB | null = null;
  for (let i = 1; i < scored.length; i++) {
    if (colorDistance(primaryRgb, scored[i]) >= 55) {
      accentRgb = scored[i];
      break;
    }
  }

  // If no distinct second color, generate a complementary or analogous accent
  if (!accentRgb) {
    const pHsl = getHSL(primaryRgb);
    const accentHue = (pHsl.h + 40) % 360;
    accentRgb = pHsl.s < 0.2 ? { r: 245, g: 158, b: 11 } : { r: 245, g: 182, b: 50 };
  }

  const primary = rgbToHex(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const accent = rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b);

  if (preferDarkTheme) {
    // Generate harmonious dark theme with subtle tint from primary
    const pHsl = getHSL(primaryRgb);
    const darkBg = pHsl.s > 0.25
      ? rgbToHex(Math.round(11 + primaryRgb.r * 0.02), Math.round(14 + primaryRgb.g * 0.02), Math.round(22 + primaryRgb.b * 0.03))
      : "#0b0f17";
    const darkSurface = pHsl.s > 0.25
      ? rgbToHex(Math.round(18 + primaryRgb.r * 0.04), Math.round(23 + primaryRgb.g * 0.04), Math.round(35 + primaryRgb.b * 0.05))
      : "#141c2b";

    return {
      primary,
      accent,
      background: darkBg,
      surface: darkSurface,
      text: "#f8fafc",
      textMuted: "#94a3b8",
      isDark: true,
    };
  }

  // Light theme
  return {
    primary,
    accent,
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    textMuted: "#64748b",
    isDark: false,
  };
}

/**
 * Extract both Light and Dark brand palettes directly from an Image source (DataURL or URL).
 */
export async function extractBrandPalettes(
  imageSrc: string
): Promise<BrandLogoExtractResult> {
  return new Promise((resolve) => {
    const fallbackLight = extractColorsFromPixels([], false);
    const fallbackDark = extractColorsFromPixels([], true);

    if (typeof window === "undefined") {
      resolve({
        light: fallbackLight,
        dark: fallbackDark,
        dominantHex: fallbackLight.primary,
        accentHex: fallbackLight.accent,
        recommendedTheme: "light",
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            light: fallbackLight,
            dark: fallbackDark,
            dominantHex: fallbackLight.primary,
            accentHex: fallbackLight.accent,
            recommendedTheme: "light",
          });
          return;
        }

        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size);
        const light = extractColorsFromPixels(imgData.data, false);
        const dark = extractColorsFromPixels(imgData.data, true);

        // Determine recommended theme:
        // If the primary color has high luminance (bright yellow, neon cyan), dark mode looks striking.
        // Otherwise, light mode is standard.
        const isBrightColor = !isDarkColor(light.primary);
        const recommendedTheme: "light" | "dark" = isBrightColor ? "dark" : "light";

        resolve({
          light,
          dark,
          dominantHex: light.primary,
          accentHex: light.accent,
          recommendedTheme,
        });
      } catch {
        resolve({
          light: fallbackLight,
          dark: fallbackDark,
          dominantHex: fallbackLight.primary,
          accentHex: fallbackLight.accent,
          recommendedTheme: "light",
        });
      }
    };

    img.onerror = () => {
      resolve({
        light: fallbackLight,
        dark: fallbackDark,
        dominantHex: fallbackLight.primary,
        accentHex: fallbackLight.accent,
        recommendedTheme: "light",
      });
    };

    img.src = imageSrc;
  });
}

/**
 * Extract single brand palette directly from an Image source (DataURL or URL) in the browser.
 */
export async function extractBrandPaletteFromImage(
  imageSrc: string,
  preferDarkTheme: boolean = false
): Promise<ExtractedBrandPalette> {
  const result = await extractBrandPalettes(imageSrc);
  return preferDarkTheme ? result.dark : result.light;
}
