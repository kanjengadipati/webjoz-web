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

  const next = {
    ...(token || {}),
    palette: {
      ...(token?.palette || {}),
      ...palette,
    },
  };

  if (themeMode) {
    next.theme_mode = themeMode;
  }

  return next;
}

