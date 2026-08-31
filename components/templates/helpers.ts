import type { DesignToken } from "./types";

function resolveCssColor(color: string): string {
  const c = (color || "").trim();
  const m = c.match(/^var\(\s*(--[^,)]+)(?:\s*,\s*([^)]+))?\)$/i);
  if (m) {
    if (typeof window !== "undefined") {
      const resolved = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(m[1].trim());
      const val = (resolved || m[2] || "").trim();
      if (val) return val;
      return c;
    }
    return m[2] ? m[2].trim() : c;
  }
  return c;
}

export function isColorDark(color: string): boolean {
  const c = resolveCssColor(color);

  // hex 3: #rgb
  const hex3 = c.match(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (hex3) {
    const r = parseInt(hex3[1] + hex3[1], 16);
    const g = parseInt(hex3[2] + hex3[2], 16);
    const b = parseInt(hex3[3] + hex3[3], 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
  }

  // hex 6: #rrggbb  or  hex 8: #rrggbbaa (ignore alpha)
  const hex6 = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  if (hex6) {
    const r = parseInt(hex6[1], 16);
    const g = parseInt(hex6[2], 16);
    const b = parseInt(hex6[3], 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
  }

  // rgb / rgba: rgb(r, g, b)
  const rgb = c.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    const r = parseInt(rgb[1]);
    const g = parseInt(rgb[2]);
    const b = parseInt(rgb[3]);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
  }

  // hsl / hsla: hsl(h, s%, l%)  — use lightness < 40% as dark heuristic
  const hsl = c.match(/^hsla?\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*([\d.]+)%/i);
  if (hsl) {
    return parseFloat(hsl[1]) < 40;
  }

  // oklch(L C H) — L ranges 0–1; < 0.4 is dark
  const oklch = c.match(/^oklch\(\s*([\d.]+)/i);
  if (oklch) {
    return parseFloat(oklch[1]) < 0.4;
  }

  // Unknown format → assume light (non-dark) to keep white text readable
  return false;
}

/** Pick a readable avatar-initial color for a given background color. */
export function avatarTextColor(background: string): string {
  return isColorDark(background) ? "#ffffff" : "#111827";
}

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

  const rawBg = p?.background ?? "#F8F9FF";
  const rawText = p?.text ?? "#1e293b";
  const isRawBgDark = isColorDark(rawBg);
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
    const isDarkBg = isColorDark(bg);
    surfaceVal = p?.surface ?? (isDarkBg ? "#1F2937" : "#FFFFFF");
    if (surfaceVal.toLowerCase() === bg.toLowerCase()) {
      surfaceVal = isDarkBg
        ? "color-mix(in srgb, var(--dt-bg) 92%, white)"
        : "color-mix(in srgb, var(--dt-bg) 96%, black)";
    }
  }

  const isDarkBg = isColorDark(bg);

  const borderVal = isDarkBg
    ? "color-mix(in srgb, var(--dt-bg) 85%, white)"
    : "color-mix(in srgb, var(--dt-bg) 88%, black)";

  const primaryColor = p?.primary ?? "#4F46E5";
  const accentColor = p?.accent ?? "#7C3AED";
  const isPrimaryDark = isColorDark(primaryColor);
  const isAccentDark = isColorDark(accentColor);

  // In dark mode, lighten primary/accent if they're too dark for dark bg
  const lightenIfDark = (hex: string, isDark: boolean) =>
    themeMode === 'dark' && isDark
      ? `color-mix(in srgb, ${hex} 70%, white)`
      : hex;

  const effPrimary = lightenIfDark(primaryColor, isPrimaryDark);
  const effAccent = lightenIfDark(accentColor, isAccentDark);

  // When dark-mode lightening is applied, the effective primary becomes a
  // light color — so foreground must switch to dark text, not white.
  const effPrimaryIsLight = themeMode === 'dark' && isPrimaryDark;
  const primaryFg = effPrimaryIsLight ? "#1e293b" : (isPrimaryDark ? "#ffffff" : "#1e293b");
  const ctaText = effPrimaryIsLight ? "#1e293b" : (isPrimaryDark ? "#ffffff" : "#1e293b");
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
    "--dt-text-muted": "color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg))",
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
  fontFamily: "var(--dt-heading-font)",
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

export function filterEmptySections(sectionOrder: string[], content: any, isEditorMode: boolean): string[] {
  if (isEditorMode) return sectionOrder;
  return sectionOrder.filter((key) => {
    if (key === "faq") return (content.faq?.items?.length ?? 0) > 0;
    if (key === "testimonials") return (content.testimonials?.items?.length ?? 0) > 0;
    if (key === "gallery") return (content.gallery?.items?.length ?? 0) > 0;
    if (key === "menu") return (content.menu?.categories?.length ?? 0) > 0;
    if (key === "catalog") return (content.catalog?.categories?.length ?? 0) > 0;
    if (key === "stats") return (content.stats?.items?.length ?? 0) > 0;
    if (key === "partners") return (content.partners?.items?.length ?? 0) > 0;
    if (key === "pricing") return (content.pricing?.plans?.length ?? 0) > 0;
    if (key === "blog") return (content.blog?.posts?.length ?? 0) > 0;
    return true;
  });
}

