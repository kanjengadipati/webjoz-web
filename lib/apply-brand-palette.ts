/**
 * Helper to merge an extracted brand color palette into a design token
 * without overriding typography, radius, effects, or layout tokens.
 */
export function applyBrandPalette(
  token: any,
  palette?: Record<string, string> | null,
  themeMode?: "light" | "dark" | null
) {
  if (!palette || Object.keys(palette).length === 0) {
    if (themeMode && token) {
      return { ...token, theme_mode: themeMode };
    }
    return token;
  }

  const isDark = themeMode === "dark" || (!themeMode && token?.theme_mode === "dark");

  const next = {
    ...(token || {}),
    palette: {
      ...(token?.palette || {}),
      ...palette,
    },
    ...(token?.dark_palette && isDark ? {
      dark_palette: {
        ...token.dark_palette,
        ...palette,
      },
    } : {}),
  };

  if (themeMode) {
    next.theme_mode = themeMode;
  }

  return next;
}

