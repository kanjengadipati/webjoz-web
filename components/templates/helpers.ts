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

  const bg = p?.background ?? "#F8F9FF";

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

  const isDarkBg = isDarkColor(bg);
  let surfaceVal = p?.surface ?? (isDarkBg ? "#1F2937" : "#FFFFFF");
  if (surfaceVal.toLowerCase() === bg.toLowerCase()) {
    surfaceVal = isDarkBg
      ? "color-mix(in srgb, var(--dt-bg) 92%, white)"
      : "color-mix(in srgb, var(--dt-bg) 96%, black)";
  }
  const borderVal = isDarkBg
    ? "color-mix(in srgb, var(--dt-bg) 85%, white)"
    : "color-mix(in srgb, var(--dt-bg) 88%, black)";

  const primaryColor = p?.primary ?? "#4F46E5";
  const isPrimaryDark = isDarkColor(primaryColor);
  const primaryFg = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaText = isPrimaryDark ? "#ffffff" : "#1e293b";
  // CTA button sits on a dark gradient background (primary→accent),
  // so we always want a high-contrast button: white bg + dark text, or
  // a subtle semi-transparent white for dark primaries.
  const ctaBtnBg = "#ffffff";
  const ctaBtnText = isDarkColor(primaryColor) ? primaryColor : "#1e293b";

  return {
    "--dt-primary": primaryColor,
    "--dt-primary-foreground": primaryFg,
    "--dt-cta-text": ctaText,
    "--dt-cta-btn-bg": ctaBtnBg,
    "--dt-cta-btn-text": ctaBtnText,
    "--dt-accent": p?.accent ?? "#7C3AED",
    "--dt-bg": bg,
    "--dt-surface": surfaceVal,
    "--dt-border": borderVal,
    "--dt-text": p?.text ?? "#1e293b",
    "--dt-text-muted": "color-mix(in srgb, var(--dt-text) 55%, transparent)",
    "--dt-heading-font": `'${ty?.heading_font ?? "Inter"}', sans-serif`,
    "--dt-body-font": `'${ty?.body_font ?? "Inter"}', sans-serif`,
    "--dt-heading-weight": ty?.heading_weight ?? "700",
    "--dt-hero-size": ty?.heading_size_hero ?? "3rem",
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
