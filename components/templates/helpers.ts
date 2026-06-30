import type { DesignToken } from "./types";

export function buildCssVars(dt: DesignToken | null | undefined): Record<string, string> {
  const p = dt?.palette;
  const ty = dt?.typography;
  const la = dt?.layout;

  const spacingMap: Record<string, string> = {
    compact: "4rem",
    normal: "5rem",
    relaxed: "7rem",
  };
  const radiusMap: Record<string, string> = {
    sharp: "0px",
    soft: "8px",
    rounded: "20px",
  };

  const isDarkColor = (hex: string) => {
    const clean = (hex || "").replace("#", "").trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }
    return false;
  };

  const rawBg = p?.background ?? "#F8F9FF";
  const rawText = p?.text ?? "#1e293b";
  const isRawBgDark = isDarkColor(rawBg);
  const themeMode = dt?.theme_mode; // undefined = auto-detect, 'light'/'dark' = forced

  // Normalise: light mode → light bg/dark text, dark mode → dark bg/light text
  let bg: string;
  let text: string;
  let surfaceVal: string;

  if (themeMode === 'dark') {
    bg = isRawBgDark ? rawBg : rawText;
    text = isRawBgDark ? rawText : rawBg;
    surfaceVal = "color-mix(in srgb, var(--dt-bg) 92%, white)";
  } else if (themeMode === 'light') {
    bg = isRawBgDark ? rawText : rawBg;
    text = isRawBgDark ? rawBg : rawText;
    surfaceVal = "color-mix(in srgb, var(--dt-bg) 96%, black)";
  } else {
    // Auto-detect — original behaviour
    bg = rawBg;
    text = rawText;
    const isDarkBg = isDarkColor(bg);
    surfaceVal = p?.surface ?? (isDarkBg ? "#1F2937" : "#FFFFFF");
    if (surfaceVal.toLowerCase() === bg.toLowerCase()) {
      surfaceVal = isDarkBg
        ? "color-mix(in srgb, var(--dt-bg) 92%, white)"
        : "color-mix(in srgb, var(--dt-bg) 96%, black)";
    }
  }

  const isDarkBg = isDarkColor(bg);

  const borderVal = isDarkBg
    ? "color-mix(in srgb, var(--dt-bg) 85%, white)"
    : "color-mix(in srgb, var(--dt-bg) 88%, black)";

  const primaryColor = p?.primary ?? "#4F46E5";
  const accentColor = p?.accent ?? "#7C3AED";
  const isPrimaryDark = isDarkColor(primaryColor);
  const isAccentDark = isDarkColor(accentColor);

  // In dark mode, lighten primary/accent if they're too dark for dark bg
  const lightenIfDark = (hex: string, isDark: boolean) =>
    themeMode === 'dark' && isDark
      ? `color-mix(in srgb, ${hex} 70%, white)`
      : hex;

  const effPrimary = lightenIfDark(primaryColor, isPrimaryDark);
  const effAccent = lightenIfDark(accentColor, isAccentDark);

  // All contrast checks use ORIGINAL colors (color-mix can't be measured in JS)
  const primaryFg = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaText = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaBtnBg = "#ffffff";
  const ctaBtnText = isPrimaryDark ? primaryColor : "#1e293b";

  return {
    "--dt-primary": effPrimary,
    "--dt-primary-foreground": primaryFg,
    "--dt-cta-text": ctaText,
    "--dt-cta-btn-bg": ctaBtnBg,
    "--dt-cta-btn-text": ctaBtnText,
    "--dt-accent": effAccent,
    "--dt-bg": bg,
    "--dt-surface": surfaceVal,
    "--dt-border": borderVal,
    "--dt-text": text,
    "--dt-text-muted": "color-mix(in srgb, var(--dt-text) 55%, transparent)",
    "--dt-heading-font": `'${ty?.heading_font ?? "Inter"}', sans-serif`,
    "--dt-body-font": `'${ty?.body_font ?? "Inter"}', sans-serif`,
    "--dt-heading-weight": ty?.heading_weight ?? "700",
    "--dt-hero-size": ty?.heading_size_hero ?? "3rem",
    "--dt-heading-style": ty?.heading_style ?? "normal",
    "--dt-heading-transform": ty?.heading_transform ?? "none",
    "--dt-heading-tracking": ty?.heading_tracking ?? "normal",
    "--dt-spacing": spacingMap[la?.section_spacing ?? "normal"] ?? "5rem",
    "--dt-radius": radiusMap[la?.corner_radius ?? "soft"] ?? "8px",
    "--dt-radius-lg": la?.corner_radius === "sharp" ? "0px" : la?.corner_radius === "rounded" ? "32px" : "16px",
    // Soft tints / hover shade — for fixed (non-Dynamic) templates that want to
    // recolor light backgrounds, badges, and hover states using the AI palette
    // without fighting contrast. Mixed toward --dt-bg so they always sit
    // naturally on the page regardless of light/dark palette.
    "--dt-primary-soft": "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-bg))",
    "--dt-primary-soft-strong": "color-mix(in srgb, var(--dt-primary) 20%, var(--dt-bg))",
    "--dt-primary-hover": isPrimaryDark
      ? "color-mix(in srgb, var(--dt-primary) 85%, white)"
      : "color-mix(in srgb, var(--dt-primary) 85%, black)",
    "--dt-accent-soft": "color-mix(in srgb, var(--dt-accent) 10%, var(--dt-bg))",
  };
}

export const headingVars: Record<string, string> = {
  fontStyle: "var(--dt-heading-style)",
  textTransform: "var(--dt-heading-transform)",
  letterSpacing: "var(--dt-heading-tracking)",
};

export const sectionTitleStyle: Record<string, string> = {
  ...headingVars,
  fontWeight: "var(--dt-heading-weight)",
  fontFamily: "var(--dt-heading-font)",
};

export function loadGoogleFont(headingFont?: string, bodyFont?: string) {
  if (typeof document === "undefined") return;
  const fonts = [headingFont, bodyFont].filter(Boolean);
  if (!fonts.length) return;
  const famStr = fonts.map((f) => f!.replace(/ /g, "+")).join("&family=");
  const id = `dt-font-${famStr}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${famStr}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}
