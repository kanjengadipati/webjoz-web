export interface ApplyBrandPaletteOptions {
  /**
   * When true, only brand identity colors (primary & accent) are merged,
   * preserving the mood's background, surface, text, and theme_mode.
   */
  identityOnly?: boolean;
}

/**
 * Helper to merge an extracted brand color palette into a design token
 * without overriding typography, radius, effects, or layout tokens.
 */
export function applyBrandPalette(
  token: any,
  palette?: Record<string, string> | null,
  themeMode?: "light" | "dark" | null,
  options?: ApplyBrandPaletteOptions
) {
  if (!palette || Object.keys(palette).length === 0) {
    if (themeMode && token) {
      return { ...token, theme_mode: themeMode };
    }
    return token;
  }

  const identityOnly = options?.identityOnly === true;
  const effectivePalette: Record<string, string> = identityOnly
    ? {
        ...(palette.primary ? { primary: palette.primary } : {}),
        ...(palette.accent ? { accent: palette.accent } : {}),
      }
    : palette;

  if (Object.keys(effectivePalette).length === 0) {
    return token;
  }

  const isDark = themeMode === "dark" || (!themeMode && token?.theme_mode === "dark");

  const next = {
    ...(token || {}),
    palette: {
      ...(token?.palette || {}),
      ...effectivePalette,
    },
    ...(token?.dark_palette && isDark ? {
      dark_palette: {
        ...token.dark_palette,
        ...effectivePalette,
      },
    } : {}),
  };

  if (themeMode && !identityOnly) {
    next.theme_mode = themeMode;
  } else if (themeMode && !next.theme_mode) {
    next.theme_mode = themeMode;
  }

  return next;
}

